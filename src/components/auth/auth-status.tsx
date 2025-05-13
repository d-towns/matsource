import { createSupabaseSSRClient } from '@/lib/supabase/ssr'
import { AuthStatusClient } from './auth-status-client'

export async function AuthStatus() {
  const supabase = await createSupabaseSSRClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log(user)
  return <AuthStatusClient user={user} />
} 