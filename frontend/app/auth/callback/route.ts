import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let nextPath = searchParams.get('next') ?? '/dashboard'
  // Prevent open redirect vulnerabilities by ensuring nextPath starts with a single slash
  if (!nextPath.startsWith('/') || nextPath.startsWith('//')) {
    nextPath = '/dashboard'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${nextPath}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${nextPath}`)
      } else {
        return NextResponse.redirect(`${origin}${nextPath}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
