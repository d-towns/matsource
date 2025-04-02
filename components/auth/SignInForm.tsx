"use client";

import { useState } from "react";
import { signIn } from "@/app/(home)/signin/actions";
import { useForm } from "react-hook-form";

interface SignInFormData {
  email: string;
  password: string;
}

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-medium text-white transition-colors hover:bg-primary/80 
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    >
      {isLoading ? "Signing in..." : "Sign in"}
    </button>
  );
}

export function SignInForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: SignInFormData) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    await signIn(formData);
    setIsLoading(false);
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-xl" htmlFor="email">
              Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="rounded-md border border-gray-800 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && <span className="text-red-500">Email is required</span>}
          </div>
          <div className="grid gap-2">
            <label className="text-xl" htmlFor="password">
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              autoComplete="current-password"
              className="rounded-md border border-gray-800 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.password && <span className="text-red-500">Password is required</span>}
          </div>
          <SubmitButton isLoading={isLoading} />
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="w-fit bg-background px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        disabled={isGoogleLoading}
        onClick={() => setIsGoogleLoading(true)}
        className="inline-flex items-center justify-center rounded-full border border-gray-800 px-8 py-2 text-sm font-medium  transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
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