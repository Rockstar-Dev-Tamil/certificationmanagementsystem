import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { signAndCommitToChain } from '@/lib/security';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { recipient_name, recipient_email, course_title, expiry_date, institution_id } = body;

        if (!recipient_name || !recipient_email || !course_title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Find or Create Profile
        let userId;
        const [existingUsers] = await pool.query<RowDataPacket[]>('SELECT id FROM profiles WHERE email = ?', [recipient_email]);

        if (existingUsers.length > 0) {
            userId = existingUsers[0].id;
        } else {
            userId = uuidv4();
            await pool.query('INSERT INTO profiles (id, full_name, email) VALUES (?, ?, ?)', [userId, recipient_name, recipient_email]);
        }

        // 2. Find or Create Template
        let templateId;
        const [existingTemplates] = await pool.query<RowDataPacket[]>('SELECT id FROM templates WHERE title = ?', [course_title]);

        if (existingTemplates.length > 0) {
            templateId = existingTemplates[0].id;
        } else {
            templateId = uuidv4();
            await pool.query('INSERT INTO templates (id, institution_id, title, description) VALUES (?, ?, ?, ?)', [templateId, institution_id || null, course_title, 'Auto-generated template']);
        }

        // 3. Generate Professional Certificate ID
        const year = new Date().getFullYear();
        const courseSlug = course_title.toUpperCase().replace(/\s+/g, '').substring(0, 4);
        const sequence = Date.now().toString().slice(-6);
        const certificate_id = `CS-${year}-${courseSlug}-${sequence}`;

        // 4. Generate Anti-Tampering Hash
        const certData = {
            certificate_id,
            recipient_email,
            course_title,
            issue_date: new Date().toISOString()
        };
        const data_hash = crypto
            .createHash('sha256')
            .update(JSON.stringify(certData))
            .digest('hex');

        // 5. Generate QR Code
        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify?id=${certificate_id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

        // 6. Insert Certificate
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO certificates (id, certificate_id, user_id, template_id, institution_id, expiry_date, qr_code, data_hash, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'valid')`,
            [uuidv4(), certificate_id, userId, templateId, institution_id || null, expiry_date || null, qrCodeDataUrl, data_hash]
        );

        // 7. Blockchain Simulation Commit
        await signAndCommitToChain(certificate_id, data_hash);

        return NextResponse.json({
            success: true,
            data: { certificate_id, data_hash }
        });

    } catch (err: any) {
        console.error('Database error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
