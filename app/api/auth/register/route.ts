import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { email, password, fullName, role = 'user' } = await request.json();

        if (!email || !password || !fullName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Check if email already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 12);

        // 2. Create User record
        const { error: userError } = await supabase
            .from('users')
            .insert([{ id: userId, email, password_hash: hashedPassword, role }]);

        if (userError) throw userError;

        // 3. Create/Sync Profile
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (existingProfile) {
            const { error: profileUpdateError } = await supabase
                .from('profiles')
                .update({ user_id: userId, full_name: fullName })
                .eq('id', existingProfile.id);
            if (profileUpdateError) throw profileUpdateError;
        } else {
            const { error: profileInsertError } = await supabase
                .from('profiles')
                .insert([{ id: uuidv4(), user_id: userId, email, full_name: fullName }]);
            if (profileInsertError) throw profileInsertError;
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
