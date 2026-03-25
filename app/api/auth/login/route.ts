import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { buildAuthCookie, createAuthToken, getProfileByUserId, logAudit } from '@/lib/security';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const normalizedEmail = String(email ?? '').trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', normalizedEmail)
            .single();

        if (error || !user || !(await bcrypt.compare(password, user.password_hash))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const profile = await getProfileByUserId(user.id);
        if (profile?.is_blocked) {
            return NextResponse.json({ error: 'This account has been blocked. Contact your administrator.' }, { status: 403 });
        }

        const token = createAuthToken({ userId: user.id, email: user.email, role: user.role });

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                full_name: profile?.full_name ?? null,
                profile_id: profile?.id ?? null,
            }
        });

        response.headers.append('Set-Cookie', buildAuthCookie(token));
        await logAudit('LOGIN', {
            performedBy: profile?.id ?? null,
            targetId: user.id,
            details: { email: user.email, role: user.role },
        });

        return response;

    } catch (err) {
        console.error('Login Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
