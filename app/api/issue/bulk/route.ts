import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { certificates } = await req.json();

        if (!certificates || !Array.isArray(certificates)) {
            return NextResponse.json({ error: 'Invalid certificates data' }, { status: 400 });
        }

        const results = [];
        const year = new Date().getFullYear();

        for (const cert of certificates) {
            const { recipient_name, recipient_email, course_title, expiry_date } = cert;

            if (!recipient_name || !recipient_email || !course_title) {
                results.push({ email: recipient_email, status: 'error', message: 'Missing fields' });
                continue;
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
                await pool.query('INSERT INTO templates (id, title, description) VALUES (?, ?, ?)', [templateId, course_title, 'Auto-generated bulk template']);
            }

            // 3. Generate ID & Hash
            const courseSlug = course_title.toUpperCase().replace(/\s+/g, '').substring(0, 4);
            const sequence = Math.random().toString(36).substring(2, 8).toUpperCase();
            const certificate_id = `CS-${year}-${courseSlug}-${sequence}`;

            const certData = { certificate_id, recipient_email, course_title, issue_date: new Date().toISOString() };
            const data_hash = crypto.createHash('sha256').update(JSON.stringify(certData)).digest('hex');

            // 4. QR Code
            const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify?id=${certificate_id}`;
            const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

            // 5. Insert
            await pool.query(
                `INSERT INTO certificates (id, certificate_id, user_id, template_id, expiry_date, qr_code, data_hash, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'valid')`,
                [uuidv4(), certificate_id, userId, templateId, expiry_date || null, qrCodeDataUrl, data_hash]
            );

            results.push({ email: recipient_email, certificate_id, status: 'success' });
        }

        return NextResponse.json({ success: true, results });

    } catch (err: any) {
        console.error('Bulk issuance error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
