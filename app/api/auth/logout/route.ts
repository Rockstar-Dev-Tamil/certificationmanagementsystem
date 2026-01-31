import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
    const response = NextResponse.json({ success: true });

    response.headers.append('Set-Cookie', serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/'
    }));

    return response;
}
