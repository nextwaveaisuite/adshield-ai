import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  if (url.pathname.startsWith('/admin')){
    // If NextAuth is configured, require session cookie; else allow cookie-based prototype
    const hasNextAuth = !!process.env.NEXTAUTH_SECRET;
    const hasSession = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');
    if (hasNextAuth && !hasSession) {
      const signInUrl = new URL('/api/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', url.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin'] };