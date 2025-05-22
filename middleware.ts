import { type NextRequest } from 'next/server'
import { updateSession, checkOnboardingStatus } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // First, update the session (handles auth)
  const sessionResponse = await updateSession(request)
  
  // If the session update resulted in a redirect (e.g., to login), return it
  if (sessionResponse.status === 307 || sessionResponse.status === 302) {
    return sessionResponse
  }
  
  // Then check onboarding status
  return await checkOnboardingStatus(request)
}

export const config = {
  matcher: ['/workspaces/:path*'],
}