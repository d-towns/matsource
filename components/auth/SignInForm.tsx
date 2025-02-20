"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/(home)/signin/actions";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // async function handleSubmit(formData: FormData) {
  //   setIsLoading(true);
  //   setError(null);

  //   const result = await signIn(formData);
    
  //   if (result?.error) {
  //     setError(result.error);
  //     setIsLoading(false);
  //   }
  // }

  return (
    <div className="grid gap-6">
      <form action={signIn}>
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-base text-gray-300" htmlFor="email">
              Email
            </label>
            <input
              name="email"
              id="email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className="rounded-md border border-gray-800 bg-black px-4 py-3 text-base text-gray-300 focus:border-matsource-500 focus:outline-none focus:ring-2 focus:ring-matsource-500"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-base text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              name="password"
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              className="rounded-md border border-gray-800 bg-black px-4 py-3 text-base text-gray-300 focus:border-matsource-500 focus:outline-none focus:ring-2 focus:ring-matsource-500"
              required
            />
          </div>
          <button
            disabled={isLoading}
            className={`inline-flex items-center justify-center rounded-full bg-matsource-500 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-matsource-400 focus:outline-none focus:ring-2 focus:ring-matsource-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="w-fit bg-black px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      <button
        type="button"
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-full border border-gray-800 bg-black px-8 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-matsource-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </button>
    </div>
  );
} 