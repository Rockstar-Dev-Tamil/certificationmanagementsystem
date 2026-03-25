import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/security';
import { v4 as uuidv4 } from 'uuid';

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

export async function POST(req: Request) {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const title = String(body?.title ?? '').trim();
        const description = body?.description ? String(body.description) : null;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const id = uuidv4();
        const { error } = await supabase
            .from('templates')
            .insert([{ id, title, description }]);

        if (error) throw error;

        return NextResponse.json({ success: true, id });
    } catch (err: any) {
        console.error('Templates create error:', err);
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}
