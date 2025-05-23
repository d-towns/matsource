import { createBrowserClient } from '@supabase/ssr'
import { config } from '@/lib/config'

export function createClient() {
  return createBrowserClient(
    config.database.url,
    config.database.anonKey,
    {
      auth: {
        flowType: 'pkce',
      },
    }
  )
} 