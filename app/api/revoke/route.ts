import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser, getProfileByUserId, logAudit } from '@/lib/security';

export async function POST(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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

        const profile = await getProfileByUserId(user.userId);
        await logAudit('REVOKE_CERTIFICATE', {
            performedBy: profile?.id ?? null,
            targetId: certificateId,
            details: { reason: reason || 'Protocol revocation triggered' },
        });

        return NextResponse.json({ success: true, message: 'Certificate revoked successfully' });

    } catch (err: any) {
        console.error('Revocation error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
