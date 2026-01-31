import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Authentication is temporarily disabled for MySQL migration.
    // TODO: Implement local auth (e.g. NextAuth.js or custom session) if needed.
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
