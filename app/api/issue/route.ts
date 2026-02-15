import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';
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
        const { data: existingProfiles, error: profileFetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', recipient_email)
            .limit(1);

        if (profileFetchError) throw profileFetchError;

        if (existingProfiles && existingProfiles.length > 0) {
            userId = existingProfiles[0].id;
        } else {
            userId = uuidv4();
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: userId, full_name: recipient_name, email: recipient_email }]);
            if (profileError) throw profileError;
        }

        // 2. Find or Create Template
        let templateId;
        const { data: existingTemplates, error: templateFetchError } = await supabase
            .from('templates')
            .select('id')
            .eq('title', course_title)
            .limit(1);

        if (templateFetchError) throw templateFetchError;

        if (existingTemplates && existingTemplates.length > 0) {
            templateId = existingTemplates[0].id;
        } else {
            templateId = uuidv4();
            const { error: templateError } = await supabase
                .from('templates')
                .insert([{
                    id: templateId,
                    institution_id: institution_id || null,
                    title: course_title,
                    description: 'Auto-generated template'
                }]);
            if (templateError) throw templateError;
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
        const liveBase = 'https://certificationmanagementsystem-nine.vercel.app';
        const verificationUrl = `${liveBase}/verify?id=${certificate_id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

        // 6. Insert Certificate
        const { error: certError } = await supabase
            .from('certificates')
            .insert([{
                id: uuidv4(),
                certificate_id,
                user_id: userId,
                template_id: templateId,
                institution_id: institution_id || null,
                expiry_date: expiry_date || null,
                qr_code: qrCodeDataUrl,
                data_hash,
                status: 'valid'
            }]);

        if (certError) throw certError;

        // 7. Blockchain Simulation Commit
        await signAndCommitToChain(certificate_id, data_hash);

        return NextResponse.json({
            success: true,
            data: { certificate_id, data_hash }
        });

    } catch (err: any) {
        console.error('Supabase error:', err);

        let errorMessage = 'An unexpected error occurred during issuance.';
        if (err.message) {
            errorMessage = err.message;
        }

        return NextResponse.json({
            success: false,
            error: errorMessage,
            code: err.code
        }, { status: 500 });
    }
}
