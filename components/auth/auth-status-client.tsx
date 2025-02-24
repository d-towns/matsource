'use client'

import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { signOut } from '@/app/(home)/signin/actions'

interface AuthStatusClientProps {
  user: User | null
}

export function AuthStatusClient({ user }: AuthStatusClientProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/signin"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/get-started"
          className="bg-matsource-500 hover:bg-matsource-400 px-6 py-2 rounded-full transition-colors"
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
        className="bg-matsource-500 hover:bg-matsource-400 px-6 py-2 rounded-full text-white transition-colors"
      >
        Dashboard
      </Link>
      <form action={signOut}>
        <button 
          type="submit"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </form>
    </div>
  )
} 