import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/signin') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}

export async function checkOnboardingStatus(request: NextRequest) {
  // Skip onboarding check for certain paths
  if (
    request.nextUrl.pathname.startsWith('/onboarding') ||
    request.nextUrl.pathname.startsWith('/signin') ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If no user, let the auth middleware handle it
    if (!user) {
      return response
    }

    // Check user's team onboarding status
    const { data: userTeamData } = await supabase
      .from('user_teams')
      .select(`
        team_id,
        teams!inner(onboarding_step)
      `)
      .eq('user_id', user.id)
      .single()

    // If user has no team or team hasn't completed onboarding, redirect to onboarding
    if (!userTeamData?.team_id || (userTeamData.teams as { onboarding_step?: string })?.onboarding_step !== 'completed') {
      const onboardingStep = (userTeamData?.teams as { onboarding_step?: string })?.onboarding_step || 'plan_selection'
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      url.searchParams.set('step', onboardingStep)
      
      const redirectResponse = NextResponse.redirect(url)
      // Copy over the cookies from the original response
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      })
      return redirectResponse
    }

    return response
  } catch (error) {
    console.error('Error checking onboarding status in middleware:', error)
    // On error, allow the request to continue to avoid breaking the app
    return response
  }
}