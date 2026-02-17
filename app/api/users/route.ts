import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/security';

export async function GET() {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch profiles and join with certificate counts
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select(`
                id,
                full_name,
                email,
                created_at,
                certificates:certificates(count)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const users = profiles.map(p => ({
            id: p.id,
            full_name: p.full_name,
            email: p.email,
            created_at: p.created_at,
            issuance_count: p.certificates ? (p.certificates[0] as any).count : 0
        }));

        return NextResponse.json(users);
    } catch (err: any) {
        console.error('Users fetch error:', err);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
