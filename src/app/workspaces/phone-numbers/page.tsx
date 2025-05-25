'use client'
import { Suspense } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/phone-numbers/phone-numbers-columns"
import { PhoneNumber } from "@/lib/models/phone_number"
import { PhoneIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePhoneNumbers } from '@/hooks/usePhoneNumbers'
import { useTeam } from '@/context/team-context'

function PhoneNumbersTable({ teamId }: { teamId: string }) {
  const { data: phoneNumbers, error, isLoading } = usePhoneNumbers(teamId)
  
  if (error) return <p className="text-destructive font-sans">Error loading phone numbers: {error.message}</p>
  
  if (isLoading) return <PhoneNumbersSkeleton />
  
  return <div className="rounded-lg border">
    <div className="flex items-center justify-between p-4">
      <h2 className="text-xl font-semibold font-sans">Phone Numbers</h2>
      <Link href="/workspaces/phone-numbers/new">
        <Button>Add Phone Number</Button>
      </Link>
    </div>
    <DataTable columns={columns} data={phoneNumbers as PhoneNumber[] || []} />
  </div>
}

function PhoneNumbersSkeleton() {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between p-4">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-9 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="p-4 space-y-3">
        {/* Table header skeleton */}
        <div className="flex space-x-4 pb-2 border-b">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
        </div>
        {/* Table rows skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-4 py-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PhoneNumbersPage() {
  const { activeTeam } = useTeam()
  if (!activeTeam?.id) {
    return <div className="text-muted-foreground font-sans">No team selected.</div>
  }
  return (
    <div className="container mx-auto py-4 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <PhoneIcon className="mr-2 h-6 w-6" />
          Phone Numbers
        </h1>
        <p className="text-muted-foreground mt-1 font-normal">
          Manage and verify phone numbers for caller ID
        </p>
      </div>
      <Suspense fallback={<PhoneNumbersSkeleton />}>
        <PhoneNumbersTable teamId={activeTeam.id} />
      </Suspense>
    </div>
  )
} 