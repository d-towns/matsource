import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SUPABASE_URL! : process.env.NEXT_PUBLIC_DEV_SUPABASE_URL!,
    process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : process.env.NEXT_PUBLIC_DEV_SUPABASE_ANON_KEY!
  )
} 