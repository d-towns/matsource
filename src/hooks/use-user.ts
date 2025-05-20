'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function useUser() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    // Fetch initial session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return
        setUser(session?.user ?? null)
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user) {
      supabase.from('users').select('partner_id').eq('id', user.id)
        .then(({ data }) => setPartnerId(data?.[0]?.partner_id ?? null))
    }
  }, [user])
  return { user, isLoading, partnerId }
} 