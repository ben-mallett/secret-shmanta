import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const route = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value || ''

    if (route === '/profile' && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    } else if (route === '/settings' && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

export const config = {
    matcher: ['/', '/profile', '/signup', '/login', '/settings']
}