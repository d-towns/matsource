'use client'

import { User } from '@supabase/supabase-js'
import Link from 'next/link'

interface AuthStatusClientProps {
  user: User | null
}

export function AuthStatusClient({ user }: AuthStatusClientProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/signin"
          className="text-muted-foreground border rounded-lg px-6 py-2 hover:text-foreground hover:bg-primary hover:text-secondary-foreground transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/get-started"
          className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors text-secondary-foreground"
        >
          Get Started
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/workspaces/dashboard"
        className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full text-primary-foreground transition-colors"
      >
        Dashboard
      </Link>
      <button 
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
} 