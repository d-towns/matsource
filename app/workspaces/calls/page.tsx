import { Suspense } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/calls/calls-columns"
import { createClient } from "@/utils/supabase/server"
import { CallAttemptWithLead } from "@/lib/models/leads"
import { PhoneIcon, PhoneCallIcon, PhoneMissedIcon, ClockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

async function getCallsWithLeadInfo() {
  const supabase = await createClient()
  
  // Get all call attempts with lead information
  const { data: calls, error } = await supabase
    .from('call_attempts')
    .select(`
      *,
      lead:lead_id (
        id,
        name,
        phone,
        email
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching call attempts:', error)
    return []
  }
  
  return calls as CallAttemptWithLead[]
}

async function getCallMetrics() {
  const supabase = await createClient()
  
  // Get total calls count
  const { count: totalCalls, error: totalCallsError } = await supabase
    .from('call_attempts')
    .select('*', { count: 'exact', head: true })
  
  // Get connected calls count
  const { count: connectedCalls, error: connectedCallsError } = await supabase
    .from('call_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('outcome', 'connected')
  
  // Get scheduled calls count
  const { count: scheduledCalls, error: scheduledCallsError } = await supabase
    .from('call_attempts')
    .select('*', { count: 'exact', head: true })
    .not('scheduled_time', 'is', null)
    .is('started_at', null)
  
  if (totalCallsError || connectedCallsError || scheduledCallsError) {
    console.error('Error fetching call metrics:', { totalCallsError, connectedCallsError, scheduledCallsError })
  }
  
  // Calculate connection rate
  const connectionRate = totalCalls && connectedCalls 
    ? Math.round((connectedCalls / totalCalls) * 100) 
    : 0
  
  return {
    totalCalls: totalCalls || 0,
    connectedCalls: connectedCalls || 0,
    scheduledCalls: scheduledCalls || 0,
    connectionRate
  }
}

async function CallsContent() {
  const calls = await getCallsWithLeadInfo()
  const metrics = await getCallMetrics()
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Calls</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.totalCalls}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <PhoneCallIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Connected Calls</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.connectedCalls}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <PhoneMissedIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Connection Rate</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.connectionRate}%</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Scheduled Calls</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.scheduledCalls}</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Call Attempts</h2>
          <Link href="/workspaces/calls/new">
            <Button>Schedule Call</Button>
          </Link>
        </div>
        <DataTable columns={columns} data={calls} />
      </div>
    </>
  )
}

export default function CallsPage() {
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <PhoneCallIcon className="mr-2 h-6 w-6" />
          Call Attempts
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all call attempts to your leads
        </p>
      </div>
      
      <Suspense fallback={<LoadingSpinner text="Loading calls data..." fullPage />}>
        <CallsContent />
      </Suspense>
    </div>
  )
} 