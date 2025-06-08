"use client"

import { SignInForm } from "@/components/auth/SignInForm"
import { SignUpForm } from "@/components/auth/SignUpForm"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const environment = process.env.NEXT_PUBLIC_NODE_ENV;


const SignInSkeleton = () => {
  return (
    <div className="container flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />  
          </div>
        </div>
      </div>
  )
}

export default function SignInPage() {
  const [mode, setMode] = useState("signin")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { user } = useUser()
  const router = useRouter()
  
  useEffect(() => {
    if (user) {
      
      router.push('/workspaces/dashboard')
    } 
    setIsLoading(false)
  }, [user])

  if (isLoading) {
    return <SignInSkeleton />
  }


  return (
    <div className="container flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <Alert variant="default" className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10">
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                Accounts are only for active clients. If you are not an active client, please <Link href="/get-started" className="underline text-matsource-500 hover:text-matsource-400">contact us</Link> to get access.
              </AlertDescription>
            </Alert>
            <h1 className="text-4xl font-semibold tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-xl text-gray-400">
              {mode === "signin" 
                ? "Enter your email to sign in to your account" 
                : "Enter your email below to create your account"}
            </p>
          </div>

          {mode === "signin" ? <SignInForm /> : <SignUpForm />}

          { environment === "development" && (
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
          )}
        </div>
      </div>
    </div>
  )
} 