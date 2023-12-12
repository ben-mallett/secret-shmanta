import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const privateRoutes = [
        '/profile',
        '/settings',
        '/settings/account',
        '/settings/group',
        '/settings/gifts',
        '/settings/users',
    ]

    const route = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value || ''

    if (privateRoutes.includes(route) && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

export const config = {
    matcher: ['/', '/profile', '/signup', '/login', '/settings']
}