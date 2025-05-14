import { createClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client with service role key for admin operations.
 * Created at runtime to avoid build-time environment issues.
 */
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase admin environment variables.')
  }
  return createClient(supabaseUrl, serviceKey)
} 