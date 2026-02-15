import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { certificateId } = await req.json();

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
            .eq('certificate_id', certificateId)
            .single();

        if (error || !certData) {
            console.error('Fetch error:', error);
            return NextResponse.json({ valid: false, error: 'Certificate not found' });
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
                template_name: certData.templates ? (certData.templates as any).title : 'Standard Certificate'
            }
        });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ valid: false });
    }
}
