"use client";

import { useState } from "react";
import { signIn, signInWithGoogle } from "@/lib/services/auth-actions";
import { useForm } from "react-hook-form";
import SignInWithGoogleButton from "./GoogleSignIn/SignInWithGoogleButton";

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

      <SignInWithGoogleButton />
    </div>
  );
} 