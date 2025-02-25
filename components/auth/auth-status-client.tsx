'use client'

import Link from 'next/link'

interface AuthStatusClientProps {
  user: any | null
}

export function AuthStatusClient({ user }: AuthStatusClientProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/signin"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/get-started"
          className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full transition-colors text-primary-foreground"
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