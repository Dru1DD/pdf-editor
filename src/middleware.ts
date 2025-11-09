import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const protectedRoutes = ['/editor', '/profile'];

    if (protectedRoutes.some((route) => path.startsWith(route)) && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (token && (path === '/login' || path === '/registration')) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: ['/', '/login', '/registration', '/editor/:path*', '/profile/:path*'],
};
