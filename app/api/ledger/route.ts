import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: rows, error } = await supabase
            .from('certificates')
            .select(`
                certificate_id,
                issue_date,
                status,
                data_hash,
                profiles (
                    full_name
                ),
                templates (
                    title
                )
            `)
            .order('issue_date', { ascending: false })
            .limit(100);

        if (error) throw error;

        // Transform for frontend
        const ledger = rows.map((row: any) => ({
            certificate_id: row.certificate_id,
            issue_date: row.issue_date,
            status: row.status,
            data_hash: row.data_hash,
            full_name: row.profiles ? row.profiles.full_name : 'N/A',
            template_name: row.templates ? row.templates.title : 'Standard'
        }));

        return NextResponse.json({
            success: true,
            ledger
        });
    } catch (err: any) {
        console.error('Ledger error:', err);
        return NextResponse.json({ error: 'Failed to fetch ledger' }, { status: 500 });
    }
}
