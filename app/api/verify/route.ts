import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function verifyCertificate(certificateId: string) {
    const normalizedId = certificateId.trim();
    if (!normalizedId) {
        return NextResponse.json({ valid: false, error: 'Certificate ID is required' }, { status: 400 });
    }

    const { data: certData, error } = await supabase
        .from('certificates')
        .select(`
            certificate_id,
            issue_date,
            expiry_date,
            status,
            revocation_reason,
            data_hash,
            qr_code,
            profiles (
                full_name,
                email
            ),
            templates (
                title
            )
        `)
        .eq('certificate_id', normalizedId)
        .single();

    if (error || !certData) {
        console.error('Fetch error:', error);
        return NextResponse.json({ valid: false, error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({
        valid: certData.status === 'valid',
        status: certData.status,
        revocation_reason: certData.revocation_reason,
        data: {
            certificate_id: certData.certificate_id,
            issue_date: certData.issue_date,
            expiry_date: certData.expiry_date,
            qr_code: certData.qr_code,
            data_hash: certData.data_hash,
            profiles: certData.profiles,
            status: certData.status,
            template_name: certData.templates ? (certData.templates as any).title : 'Standard Certificate'
        }
    });
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const certificateId = url.searchParams.get('id') ?? '';
        return await verifyCertificate(certificateId);
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ valid: false, error: 'Unable to verify certificate' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { certificateId } = await req.json();
        return await verifyCertificate(String(certificateId ?? ''));
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ valid: false, error: 'Unable to verify certificate' }, { status: 500 });
    }
}
