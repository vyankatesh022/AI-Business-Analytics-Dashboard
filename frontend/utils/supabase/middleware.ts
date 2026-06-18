import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-site request forgery attacks.
  let user = null;

  // STRICTLY LOCAL DEV: Mock Authentication Bypass
  if (process.env.NODE_ENV !== 'production' && request.cookies.has('vibe_mock_auth')) {
    try {
      const mockCookie = request.cookies.get('vibe_mock_auth');
      if (mockCookie && mockCookie.value) {
        user = JSON.parse(mockCookie.value).user;
      }
    } catch {
      console.error("Failed to parse mock auth cookie");
    }
  }

  // Fallback to actual Supabase authentication if no mock exists
  if (!user) {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/datasets', '/analytics', '/ai-insights', '/reports', '/billing', '/settings', '/uploads']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (
    !user && isProtectedRoute
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password']
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
