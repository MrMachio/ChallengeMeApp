import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Маршруты, которые не требуют аутентификации
const publicRoutes = [
  '/login',
  '/register',
  '/api/auth',
]

// Статические файлы и системные маршруты
const systemRoutes = [
  '/_next',
  '/favicon.ico',
  '/api/uploadthing',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем системные маршруты и статические файлы
  if (
    systemRoutes.some(route => pathname.startsWith(route)) ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Пропускаем публичные маршруты
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Главная страница доступна всем
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