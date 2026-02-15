import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { certificateId, reason } = await req.json();

        if (!certificateId) {
            return NextResponse.json({ error: 'Missing certificateId' }, { status: 400 });
        }

        const { data, error: updateError } = await supabase
            .from('certificates')
            .update({
                status: 'revoked',
                revocation_reason: reason || 'No reason provided'
            })
            .eq('certificate_id', certificateId)
            .select();

        if (updateError || !data || data.length === 0) {
            return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
        }

        // Log the action in audit_logs
        await supabase
            .from('audit_logs')
            .insert([{
                action: 'REVOKE_CERTIFICATE',
                target_id: certificateId,
                details: reason || 'Protocol revocation triggered'
            }]);

        return NextResponse.json({ success: true, message: 'Certificate revoked successfully' });

    } catch (err: any) {
        console.error('Revocation error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
