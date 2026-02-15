import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/security';

export async function GET(req: Request) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const url = new URL(req.url);
        const userId = user.role === 'admin' ? url.searchParams.get('userId') : user.userId;

        let query = supabase
            .from('certificates')
            .select(`
                certificate_id,
                issue_date,
                expiry_date,
                status,
                templates (
                    title
                )
            `)
            .order('issue_date', { ascending: false });

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data: rows, error } = await query;

        if (error) throw error;

        // Transform for frontend
        const certificates = rows.map((row) => ({
            id: row.certificate_id,
            title: row.templates ? (row.templates as any).title : 'Certificate',
            date: new Date(row.issue_date).toLocaleDateString(),
            expiry: row.expiry_date ? new Date(row.expiry_date).toLocaleDateString() : 'N/A',
            recipient: user.role === 'admin' ? 'Recipient' : 'You',
        }));

        return NextResponse.json(certificates);
    } catch (err: any) {
        console.error('Certificates error:', err);
        return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
    }
}
