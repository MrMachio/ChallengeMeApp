import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/api/auth',
]

// Static files and system routes
const systemRoutes = [
  '/_next',
  '/favicon.ico',
  '/api/uploadthing',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip system routes and static files
  if (
    systemRoutes.some(route => pathname.startsWith(route)) ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Skip public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Home page is accessible to everyone
  if (pathname === '/') {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 