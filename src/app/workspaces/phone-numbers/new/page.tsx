'use client'
import { useRouter } from "next/navigation"
import { CallerIdVerification } from "@/components/onboarding/caller-id-verification"

export default function NewPhoneNumberPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-4 font-sans max-w-2xl">
      <CallerIdVerification
        onComplete={() => router.push("/workspaces/phone-numbers")}
        onSkip={() => router.push("/workspaces/phone-numbers")}
      />
    </div>
  )
} 