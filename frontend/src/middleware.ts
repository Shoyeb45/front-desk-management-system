import { decodeToken } from '@/lib/utils';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = decodeToken(token);
  if (!user) {
    console.log("Failed to decode token");
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect user based on role only if they are outside their section
  if (user?.role === 'ADMIN' && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (user?.role === 'STAFF' && !pathname.startsWith('/staff')) {
    return NextResponse.redirect(new URL('/staff', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/staff/:path*',
    // '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
