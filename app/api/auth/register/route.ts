import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { buildAuthCookie, createAuthToken, logAudit } from '@/lib/security';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, fullName, role = 'user', orgSecret } = body;
        const normalizedEmail = String(email ?? '').trim().toLowerCase();
        const normalizedFullName = String(fullName ?? '').trim();
        const normalizedRole = role === 'admin' ? 'admin' : 'user';

        if (!normalizedEmail || !password || !normalizedFullName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
        }

        const { count: adminCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'admin');

        const shouldAllowBootstrapAdmin = normalizedRole === 'admin' && (adminCount ?? 0) === 0;

        if (normalizedRole === 'admin' && !shouldAllowBootstrapAdmin) {
            const headerSecret = request.headers.get('x-org-secret');
            const providedSecret = String(headerSecret || orgSecret || '').trim();
            const expectedSecret = process.env.ORG_SECRET_KEY;
            if (!expectedSecret || providedSecret !== expectedSecret) {
                return NextResponse.json({ error: 'Invalid Organization Security Key' }, { status: 403 });
            }
        }

        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', normalizedEmail)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: 'Identity already registered in protocol' }, { status: 409 });
        }

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 12);

        const { error: userError } = await supabase
            .from('users')
            .insert([{ id: userId, email: normalizedEmail, password_hash: hashedPassword, role: normalizedRole }]);

        if (userError) throw userError;

        const { data: floatingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', normalizedEmail)
            .is('user_id', null);

        let profileId = uuidv4();
        if (floatingProfile && floatingProfile.length > 0) {
            profileId = floatingProfile[0].id;
            const { error: syncError } = await supabase
                .from('profiles')
                .update({ user_id: userId, full_name: normalizedFullName })
                .eq('id', floatingProfile[0].id);
            if (syncError) throw syncError;
        } else {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: profileId, user_id: userId, email: normalizedEmail, full_name: normalizedFullName }]);
            if (profileError) throw profileError;
        }

        const token = createAuthToken({ userId, email: normalizedEmail, role: normalizedRole });
        const response = NextResponse.json({
            success: true,
            message: 'User registered successfully',
            user: { id: userId, email: normalizedEmail, role: normalizedRole, full_name: normalizedFullName, profile_id: profileId }
        });
        response.headers.append('Set-Cookie', buildAuthCookie(token));
        await logAudit('REGISTER', {
            performedBy: profileId,
            targetId: userId,
            details: { email: normalizedEmail, role: normalizedRole, bootstrap_admin: shouldAllowBootstrapAdmin },
        });

        return response;
    } catch (err: any) {
        console.error('Registration Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
