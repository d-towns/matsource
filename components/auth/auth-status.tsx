import { createClient } from '@/utils/supabase/server'
import { AuthStatusClient } from './auth-status-client'

export async function AuthStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log(user)
  return <AuthStatusClient user={user} />
} 