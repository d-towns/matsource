"use client"

import { useState } from "react"
import { SignInForm } from "@/components/auth/SignInForm"
import { SignUpForm } from "@/components/auth/SignUpForm"

export default function SignInPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  return (
    <div className="container flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-gray-400">
              {mode === "signin" 
                ? "Enter your email to sign in to your account" 
                : "Enter your email below to create your account"}
            </p>
          </div>

          {mode === "signin" ? <SignInForm /> : <SignUpForm />}

          <p className="px-8 text-center text-sm text-gray-400">
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button 
                  onClick={() => setMode("signup")}
                  className="underline text-matsource-500 hover:text-matsource-400"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button 
                  onClick={() => setMode("signin")}
                  className="underline text-matsource-500 hover:text-matsource-400"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
} 