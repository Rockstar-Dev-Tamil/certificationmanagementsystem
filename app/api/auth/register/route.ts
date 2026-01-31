import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { email, password, fullName, role = 'user' } = await request.json();

        if (!email || !password || !fullName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user or profile with this email already exists
        const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        const [existingProfile] = await pool.query('SELECT id FROM profiles WHERE email = ?', [email]);

        if ((existingUser as any[]).length > 0 || (existingProfile as any[]).length > 0) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 12);

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Create User
            await connection.query(
                'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [userId, email, hashedPassword, role]
            );

            // 2. Check if a profile already exists for this email
            const [existingProfiles] = await connection.query<any[]>(
                'SELECT id, user_id FROM profiles WHERE email = ?',
                [email]
            );

            if (existingProfiles.length > 0) {
                const profile = existingProfiles[0];
                if (profile.user_id) {
                    // This profile is already linked to a user (shouldn't happen with our checks at the top, but safe to handle)
                    await connection.rollback();
                    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
                }

                // Update existing profile with the new user_id
                await connection.query(
                    'UPDATE profiles SET user_id = ?, full_name = ?, role = ? WHERE id = ?',
                    [userId, fullName, role, profile.id]
                );
            } else {
                // Create new Profile
                const profileId = uuidv4();
                await connection.query(
                    'INSERT INTO profiles (id, user_id, email, full_name, role) VALUES (?, ?, ?, ?, ?)',
                    [profileId, userId, email, fullName, role]
                );
            }

            await connection.commit();

            return NextResponse.json({
                success: true,
                message: 'User registered successfully',
                user: { id: userId, email, role }
            });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (err: any) {
        console.error('Registration Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
