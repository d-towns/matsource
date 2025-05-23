import { createClient } from '@supabase/supabase-js'
import { config } from '@/lib/config'

/**
 * Create a Supabase client with service role key for admin operations.
 * Created at runtime to avoid build-time environment issues.
 */
export function getSupabaseAdminClient() {
  return createClient(config.database.url, config.database.serviceRoleKey)
} 