import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, fullName, role = 'user', orgSecret } = body;

        if (!email || !password || !fullName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Secret Key Check for Organizations
        if (role === 'admin' || role === 'issuer') {
            const headerSecret = request.headers.get('x-org-secret');
            const providedSecret = headerSecret || orgSecret;
            if (providedSecret !== process.env.ORG_SECRET_KEY) {
                return NextResponse.json({ error: 'Invalid Organization Security Key' }, { status: 403 });
            }
        }

        // 2. Check if email already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: 'Identity already registered in protocol' }, { status: 409 });
        }

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Create User record
        const { error: userError } = await supabase
            .from('users')
            .insert([{ id: userId, email, password_hash: hashedPassword, role }]);

        if (userError) throw userError;

        // 4. Critical Sync: Link existing floating profiles to this user identity
        const { data: floatingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .is('user_id', null);

        if (floatingProfile && floatingProfile.length > 0) {
            const { error: syncError } = await supabase
                .from('profiles')
                .update({ user_id: userId, full_name: fullName })
                .eq('id', floatingProfile[0].id);
            if (syncError) throw syncError;
        } else {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: uuidv4(), user_id: userId, email, full_name: fullName }]);
            if (profileError) throw profileError;
        }

        return NextResponse.json({
            success: true,
            message: 'User registered successfully',
            user: { id: userId, email, role }
        });

    } catch (err: any) {
        console.error('Registration Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
