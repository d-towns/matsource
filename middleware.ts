import { type NextRequest, NextResponse } from 'next/server'
import { updateSession, checkOnboardingStatus } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''

  if (pathname.startsWith('/workspaces')) {
    // First, update the session (handles auth)
    console.log('deez nuts 2')
    const sessionResponse = await updateSession(request)

    // If the session update resulted in a redirect (e.g., to login), return it
    if (sessionResponse.status === 307 || sessionResponse.status === 302) {
      sessionResponse.headers.set('X-Host-Domain', host)
      return sessionResponse
    }

    // Then check onboarding status
    const onboardingResponse = await checkOnboardingStatus(request)
    onboardingResponse.headers.set('X-Host-Domain', host)
    return onboardingResponse
  }

  // This handles all other paths matched in config, including '/'
  const response = NextResponse.next()
  if (pathname === '/') {
    console.log('deez nuts')
    console.log('host', host)
  }
  response.headers.set(`X-Host-Domain`, host)
  return response
}

export const config = {
  matcher: ['/', '/workspaces/:path*'],
}