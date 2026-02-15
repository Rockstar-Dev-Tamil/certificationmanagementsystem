import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const now = new Date().toISOString();

        // Find certificates that have expired
        const { data: expiredCerts, error: fetchError } = await supabase
            .from('certificates')
            .select('id, certificate_id')
            .lt('expiry_date', now)
            .eq('status', 'valid');

        if (fetchError) throw fetchError;

        const count = expiredCerts?.length || 0;

        if (count > 0) {
            // Update them to 'expired'
            const ids = expiredCerts.map(c => c.id);
            const { error: updateError } = await supabase
                .from('certificates')
                .update({ status: 'expired' })
                .in('id', ids);

            if (updateError) throw updateError;

            console.log(`[Auto-Expiry] ${count} certificates marked as expired.`);

            // Log the auto-cleanup
            await supabase
                .from('audit_logs')
                .insert([{
                    action: 'AUTO_EXPIRY_ENGINE',
                    details: `${count} certificates expired automatically.`
                }]);
        }

        return NextResponse.json({
            success: true,
            expired_count: count
        });
    } catch (err: any) {
        console.error('Auto-expiry error:', err);
        return NextResponse.json({ error: 'Failed to run auto-expiry engine' }, { status: 500 });
    }
}
