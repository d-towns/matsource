import { createClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client with service role key for admin operations.
 * Created at runtime to avoid build-time environment issues.
 */
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SUPABASE_URL : process.env.NEXT_PUBLIC_DEV_SUPABASE_URL
  const serviceKey = process.env.NODE_ENV === 'production' ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_DEV_SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase admin environment variables.')
  }
  return createClient(supabaseUrl, serviceKey)
} 