'use client'

import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { signOut } from "@/lib/services/auth-actions";
interface AuthStatusClientProps {
  user: User | null
  showSignOut?: boolean
  showGetStarted?: boolean
}

export function AuthStatusClient({ user, showSignOut = true, showGetStarted = true }: AuthStatusClientProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/signin"
          className="text-muted-foreground border border-gray-400 rounded-lg px-6 py-2 hover:text-white hover:bg-primary hover:text-secondary-foreground transition-colors"
        >
          Sign In
        </Link>
        {showGetStarted && (
          <Link
            href="/get-started"
            className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors text-white"
        >
            Get Started
          </Link>
        )}
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
      {showSignOut && (
        <button 
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => {
            signOut()
          }}
        >
          Sign Out
        </button>
      )}
    </div>
  )
} 