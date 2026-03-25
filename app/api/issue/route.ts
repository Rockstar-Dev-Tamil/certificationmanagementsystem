import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

import { supabase } from '@/lib/supabase';
import {
    getAuthUser,
    getBaseUrl,
    getProfileByUserId,
    getSettingsMap,
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
        const authUser = await getAuthUser();
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const recipient_name = String(body?.recipient_name ?? '').trim();
        const recipient_email = String(body?.recipient_email ?? '').trim().toLowerCase();
        const course_title = String(body?.course_title ?? '').trim();
        const issue_date = normalizeDate(body?.issue_date) ?? new Date().toISOString();
        const providedExpiryDate = normalizeDate(body?.expiry_date);
        const providedTemplateId = String(body?.template_id ?? '').trim() || null;

        if (!recipient_name || !recipient_email || !course_title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const profile = await getProfileByUserId(authUser.userId);
        const settings = await getSettingsMap(['cert.default_expiry_days', 'cert.default_template_id']);

        let expiryDate = providedExpiryDate;
        if (!expiryDate && settings['cert.default_expiry_days']) {
            const days = Number(settings['cert.default_expiry_days']);
            if (Number.isFinite(days) && days > 0) {
                const expiry = new Date(issue_date);
                expiry.setDate(expiry.getDate() + days);
                expiryDate = expiry.toISOString();
            }
        }

        let recipientProfileId: string;
        const { data: existingProfiles, error: profileFetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', recipient_email)
            .limit(1);

        if (profileFetchError) {
            throw profileFetchError;
        }

        if (existingProfiles && existingProfiles.length > 0) {
            recipientProfileId = existingProfiles[0].id;
        } else {
            recipientProfileId = uuidv4();
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: recipientProfileId, full_name: recipient_name, email: recipient_email }]);
            if (profileError) {
                throw profileError;
            }
        }

        let templateId = providedTemplateId || settings['cert.default_template_id'] || null;
        if (templateId) {
            const { data: existingTemplate, error: templateLookupError } = await supabase
                .from('templates')
                .select('id,title')
                .eq('id', templateId)
                .single();
            if (templateLookupError || !existingTemplate) {
                templateId = null;
            }
        }

        if (!templateId) {
            const { data: existingTemplates, error: templateFetchError } = await supabase
                .from('templates')
                .select('id')
                .eq('title', course_title)
                .limit(1);

            if (templateFetchError) {
                throw templateFetchError;
            }

            if (existingTemplates && existingTemplates.length > 0) {
                templateId = existingTemplates[0].id;
            } else {
                templateId = uuidv4();
                const { error: templateError } = await supabase
                    .from('templates')
                    .insert([{
                        id: templateId,
                        title: course_title,
                        description: 'Auto-generated template',
                    }]);
                if (templateError) {
                    throw templateError;
                }
            }
        }

        const year = new Date(issue_date).getFullYear();
        const courseSlug = course_title.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4) || 'CERT';
        const sequence = Date.now().toString().slice(-6);
        const certificate_id = `CS-${year}-${courseSlug}-${sequence}`;

        const certData = {
            certificate_id,
            recipient_email,
            course_title,
            issue_date,
            expiry_date: expiryDate,
        };
        const data_hash = crypto
            .createHash('sha256')
            .update(JSON.stringify(certData))
            .digest('hex');

        const verificationUrl = `${getBaseUrl()}/verify?id=${certificate_id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

        const { error: certError } = await supabase
            .from('certificates')
            .insert([{
                id: uuidv4(),
                certificate_id,
                user_id: recipientProfileId,
                template_id: templateId,
                issue_date,
                expiry_date: expiryDate,
                qr_code: qrCodeDataUrl,
                data_hash,
                status: 'valid',
            }]);

        if (certError) {
            throw certError;
        }

        await signAndCommitToChain(certificate_id, data_hash);
        await logAudit('ISSUE_CERTIFICATE', {
            performedBy: profile?.id ?? null,
            targetId: certificate_id,
            details: {
                recipient_email,
                recipient_name,
                course_title,
                template_id: templateId,
                issue_date,
                expiry_date: expiryDate,
            },
        });

        return NextResponse.json({
            success: true,
            data: { certificate_id, data_hash, verificationUrl },
        });
    } catch (err: any) {
        console.error('Supabase error:', err);

        return NextResponse.json({
            success: false,
            error: err?.message || 'An unexpected error occurred during issuance.',
            code: err?.code,
        }, { status: 500 });
    }
}
