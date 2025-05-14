import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Create a Supabase client on the server side,
 * forwarding cookies for authenticated requests in Next.js.
 */
export async function createSupabaseSSRClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_DEV_SUPABASE_URL!
      : process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_DEV_SUPABASE_ANON_KEY!
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ignore setAll errors in Server Components
          }
        },
      },
    }
  )
} 