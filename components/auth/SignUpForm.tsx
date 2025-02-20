"use client";

import { useState } from "react";
import { signUp } from "@/app/(home)/signin/actions";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="grid gap-6">
      <form action={signUp}>
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
              autoComplete="new-password"
              disabled={isLoading}
              className="rounded-md border border-gray-800 bg-black px-4 py-3 text-base text-gray-300 focus:border-matsource-500 focus:outline-none focus:ring-2 focus:ring-matsource-500"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-base text-gray-300" htmlFor="confirm">
              Confirm Password
            </label>
            <input
              name="confirm"
              id="confirm"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              className="rounded-md border border-gray-800 bg-black px-4 py-3 text-base text-gray-300 focus:border-matsource-500 focus:outline-none focus:ring-2 focus:ring-matsource-500"
              required
            />
          </div>
          <button
            disabled={isLoading}
            className={`inline-flex items-center justify-center rounded-full bg-matsource-500 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-matsource-400 focus:outline-none focus:ring-2 focus:ring-matsource-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none`}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </div>
      </form>
    </div>
  );
} 