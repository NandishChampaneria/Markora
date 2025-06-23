import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow access only to the contact page and its assets
  const pathname = request.nextUrl.pathname;
  
  // Allow these paths to pass through
  const allowedPaths = [
    '/contact',
    '/privacy',
    '/terms',
    '/_next',
    '/api',
    '/favicon.ico',
    '/images',
    '/static'
  ];
  
  // Check if the current path is allowed
  const isAllowed = allowedPaths.some(path => pathname.startsWith(path));
  
  // If not allowed and not already on contact page, redirect to contact
  if (!isAllowed && pathname !== '/contact') {
    return NextResponse.redirect(new URL('/contact', request.url));
  }
  
  // Set the pathname header for the layout to use
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 