import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/security';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { is_blocked, role } = await req.json();

        // Update profile (blocked status)
        if (typeof is_blocked !== 'undefined') {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ is_blocked })
                .eq('id', params.id);
            if (profileError) throw profileError;
        }

        // Update user role (if user_id present)
        if (role) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('user_id')
                .eq('id', params.id)
                .single();

            if (profile?.user_id) {
                const { error: userError } = await supabase
                    .from('users')
                    .update({ role })
                    .eq('id', profile.user_id);
                if (userError) throw userError;
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
