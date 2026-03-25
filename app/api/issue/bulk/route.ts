import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

import { supabase } from '@/lib/supabase';
import {
    getAuthUser,
    getBaseUrl,
    getProfileByUserId,
    logAudit,
    signAndCommitToChain,
} from '@/lib/security';

function normalizeDate(input?: string | null) {
    if (!input) return null;
    const date = new Date(input);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function POST(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const certificates = Array.isArray(body?.certificates) ? body.certificates : null;

        if (!certificates) {
            return NextResponse.json({ error: 'Invalid certificates data' }, { status: 400 });
        }

        const actorProfile = await getProfileByUserId(user.userId);
        const results: Array<{ email: string; status: 'success' | 'failed'; certificate_id?: string; error?: string }> = [];
        const year = new Date().getFullYear();
        const baseUrl = getBaseUrl();

        for (const cert of certificates) {
            const recipient_name = String(cert?.recipient_name ?? '').trim();
            const recipient_email = String(cert?.recipient_email ?? '').trim().toLowerCase();
            const course_title = String(cert?.course_title ?? '').trim();
            const expiry_date = normalizeDate(cert?.expiry_date);

            if (!recipient_name || !recipient_email || !course_title) {
                results.push({ email: recipient_email || 'unknown', status: 'failed', error: 'Missing required fields' });
                continue;
            }

            try {
                let profileId: string;
                const { data: profile, error: profileLookupError } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('email', recipient_email)
                    .single();

                if (profileLookupError && profileLookupError.code !== 'PGRST116') {
                    throw profileLookupError;
                }

                if (profile?.id) {
                    profileId = profile.id;
                } else {
                    profileId = uuidv4();
                    const { error: profileInsertError } = await supabase
                        .from('profiles')
                        .insert([{ id: profileId, full_name: recipient_name, email: recipient_email }]);
                    if (profileInsertError) {
                        throw profileInsertError;
                    }
                }

                let templateId: string;
                const { data: template, error: templateLookupError } = await supabase
                    .from('templates')
                    .select('id')
                    .eq('title', course_title)
                    .single();

                if (templateLookupError && templateLookupError.code !== 'PGRST116') {
                    throw templateLookupError;
                }

                if (template?.id) {
                    templateId = template.id;
                } else {
                    templateId = uuidv4();
                    const { error: templateInsertError } = await supabase
                        .from('templates')
                        .insert([{ id: templateId, title: course_title, description: 'Auto-generated bulk template' }]);
                    if (templateInsertError) {
                        throw templateInsertError;
                    }
                }

                const courseSlug = course_title.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4) || 'CERT';
                const sequence = Math.random().toString(36).substring(2, 8).toUpperCase();
                const certificate_id = `CS-${year}-${courseSlug}-${sequence}`;
                const issue_date = new Date().toISOString();

                const certData = { certificate_id, recipient_email, course_title, issue_date, expiry_date };
                const data_hash = crypto.createHash('sha256').update(JSON.stringify(certData)).digest('hex');

                const verificationUrl = `${baseUrl}/verify?id=${certificate_id}`;
                const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

                const { error: certInsertError } = await supabase
                    .from('certificates')
                    .insert([{
                        id: uuidv4(),
                        certificate_id,
                        user_id: profileId,
                        template_id: templateId,
                        expiry_date,
                        qr_code: qrCodeDataUrl,
                        data_hash,
                        status: 'valid',
                    }]);

                if (certInsertError) {
                    throw certInsertError;
                }

                await signAndCommitToChain(certificate_id, data_hash);
                await logAudit('ISSUE_CERTIFICATE_BULK', {
                    performedBy: actorProfile?.id ?? null,
                    targetId: certificate_id,
                    details: { recipient_email, recipient_name, course_title },
                });

                results.push({ email: recipient_email, certificate_id, status: 'success' });
            } catch (error: any) {
                results.push({
                    email: recipient_email,
                    status: 'failed',
                    error: error?.message || 'Failed to record certificate',
                });
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (err: any) {
        console.error('Bulk issuance error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
