import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/security';

export async function GET() {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase.from('settings').select('key,value,updated_at');
        if (error) throw error;

        const settings: Record<string, string | null> = {};
        for (const row of data ?? []) {
            settings[row.key] = row.value;
        }

        return NextResponse.json({ success: true, settings });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load settings';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body: unknown = await req.json();
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
        }

        const operations = Object.entries(body as Record<string, unknown>)
            .filter(([key]) => Boolean(key))
            .map(([key, value]) => ({
                key,
                value: value === null || value === undefined ? null : String(value),
                updated_at: new Date().toISOString(),
            }));

        const { error } = await supabase
            .from('settings')
            .upsert(operations, { onConflict: 'key' });

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save settings';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body: unknown = await req.json();
        const key = body && typeof body === 'object' && 'key' in body ? String((body as any).key) : '';
        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        const { error } = await supabase.from('settings').delete().eq('key', key);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete setting';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
