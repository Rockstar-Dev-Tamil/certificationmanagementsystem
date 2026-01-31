import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ user: null });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return NextResponse.json({ user: decoded });

    } catch (err) {
        return NextResponse.json({ user: null });
    }
}
