import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';
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
            const { data: profile, error: profileFetchError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', recipient_email)
                .single();

            if (profile) {
                userId = profile.id;
            } else {
                userId = uuidv4();
                const { error: profileInsertError } = await supabase
                    .from('profiles')
                    .insert([{ id: userId, full_name: recipient_name, email: recipient_email }]);
                if (profileInsertError) {
                    results.push({ email: recipient_email, status: 'error', message: 'Failed to create profile' });
                    continue;
                }
            }

            // 2. Find or Create Template
            let templateId;
            const { data: template, error: templateFetchError } = await supabase
                .from('templates')
                .select('id')
                .eq('title', course_title)
                .single();

            if (template) {
                templateId = template.id;
            } else {
                templateId = uuidv4();
                const { error: templateInsertError } = await supabase
                    .from('templates')
                    .insert([{ id: templateId, title: course_title, description: 'Auto-generated bulk template' }]);
                if (templateInsertError) {
                    results.push({ email: recipient_email, status: 'error', message: 'Failed to create template' });
                    continue;
                }
            }

            // 3. Generate ID & Hash
            const courseSlug = course_title.toUpperCase().replace(/\s+/g, '').substring(0, 4);
            const sequence = Math.random().toString(36).substring(2, 8).toUpperCase();
            const certificate_id = `CS-${year}-${courseSlug}-${sequence}`;

            const certData = { certificate_id, recipient_email, course_title, issue_date: new Date().toISOString() };
            const data_hash = crypto.createHash('sha256').update(JSON.stringify(certData)).digest('hex');

            // 4. QR Code
            const liveBase = 'https://certificationmanagementsystem-nine.vercel.app';
            const verificationUrl = `${liveBase}/verify?id=${certificate_id}`;
            const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

            // 5. Insert
            const { error: certInsertError } = await supabase
                .from('certificates')
                .insert([{
                    id: uuidv4(),
                    certificate_id,
                    user_id: userId,
                    template_id: templateId,
                    expiry_date: expiry_date || null,
                    qr_code: qrCodeDataUrl,
                    data_hash,
                    status: 'valid'
                }]);

            if (certInsertError) {
                results.push({ email: recipient_email, status: 'error', message: 'Failed to record certificate' });
                continue;
            }

            results.push({ email: recipient_email, certificate_id, status: 'success' });
        }

        return NextResponse.json({ success: true, results });

    } catch (err: any) {
        console.error('Bulk issuance error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
