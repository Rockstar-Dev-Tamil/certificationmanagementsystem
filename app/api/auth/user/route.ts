import { NextResponse } from 'next/server';
import { getAuthUser, getProfileByUserId } from '@/lib/security';

export async function GET() {
    try {
        const decoded = await getAuthUser();
        if (!decoded) {
            return NextResponse.json({ user: null });
        }

        const profile = await getProfileByUserId(decoded.userId);
        return NextResponse.json({
            user: {
                ...decoded,
                full_name: profile?.full_name ?? null,
                profile_id: profile?.id ?? null,
                is_blocked: profile?.is_blocked ?? false,
            }
        });
    } catch {
        return NextResponse.json({ user: null });
    }
}
