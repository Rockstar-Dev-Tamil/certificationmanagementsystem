import { NextResponse } from 'next/server';
import { buildLogoutCookie } from '@/lib/security';

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.headers.append('Set-Cookie', buildLogoutCookie());

    return response;
}
