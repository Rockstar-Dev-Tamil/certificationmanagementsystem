import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/security';

export async function GET() {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data: templates, error } = await supabase
            .from('templates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(templates);
    } catch (err: any) {
        console.error('Templates fetch error:', err);
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
}
