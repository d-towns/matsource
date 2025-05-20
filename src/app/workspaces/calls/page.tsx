'use client'
import { Suspense } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/calls/calls-columns"
// import { PhoneIcon, PhoneCallIcon, PhoneMissedIcon, ClockIcon } from "lucide-react"
import { PhoneCallIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCallsWithLead } from '@/hooks/useCalls'
import { useTeam } from '@/context/team-context'

function CallsTable({ teamId }: { teamId: string }) {
  const { data: calls, error } = useCallsWithLead(teamId)
  if (error) return <p className="text-destructive font-sans">Error loading calls: {error.message}</p>
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold font-sans">Call Attempts</h2>
        <Link href="/workspaces/calls/new">
          <Button>Schedule Call</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={calls || []} />
    </div>
  )
}

function CallsSkeleton() {
  return <div className="h-40 w-full bg-muted rounded animate-pulse my-8" />
}

function MetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow p-6 animate-pulse h-24" />
      ))}
    </div>
  )
}

export default function CallsPage() {
  const { activeTeam } = useTeam()
  if (!activeTeam?.id) {
    return <div className="text-muted-foreground font-sans">No team selected.</div>
  }
  return (
    <div className="container mx-auto py-4 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <PhoneCallIcon className="mr-2 h-6 w-6" />
          Call Attempts
        </h1>
        <p className="text-muted-foreground mt-1 font-normal">
          View and manage all call attempts to your leads
        </p>
      </div>
      <Suspense fallback={<MetricsSkeleton />}>
        {/* Metrics would go here as a client-side hook in a real implementation */}
      </Suspense>
      <Suspense fallback={<CallsSkeleton />}>
        <CallsTable teamId={activeTeam.id} />
      </Suspense>
    </div>
  )
} 