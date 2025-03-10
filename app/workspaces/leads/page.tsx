import { Suspense } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/leads/leads-columns"
import { createClient } from "@/utils/supabase/server"
import { LeadWithCallCount } from "@/lib/models/leads"
import { UsersIcon, PhoneIcon, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getLeadsWithCallCounts() {
  const supabase = await createClient()
  
  // Get all leads
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*, call_attempts(id, outcome, started_at)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching leads:', error)
    return []
  }
  
  // Transform the data to include call counts and last call info
  const leadsWithCounts: LeadWithCallCount[] = leads.map(lead => {
    const callAttempts = lead.call_attempts || []
    delete lead.call_attempts
    
    // Sort call attempts by started_at to get the most recent one
    const sortedCalls = [...callAttempts].sort((a, b) => {
      if (!a.started_at) return 1
      if (!b.started_at) return -1
      return new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    })
    
    const lastCall = sortedCalls[0]
    
    return {
      ...lead,
      call_count: callAttempts.length,
      last_call_date: lastCall?.started_at,
      last_call_outcome: lastCall?.outcome
    }
  })
  
  return leadsWithCounts
}

async function getMetrics() {
  const supabase = await createClient()
  
  // Get total leads count
  const { count: totalLeads, error: leadsError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
  
  // Get total call attempts count
  const { count: totalCalls, error: callsError } = await supabase
    .from('call_attempts')
    .select('*', { count: 'exact', head: true })
  
  // Get leads with appointments count
  const { count: scheduledAppointments, error: appointmentsError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'appointment_scheduled')
  
  if (leadsError || callsError || appointmentsError) {
    console.error('Error fetching metrics:', { leadsError, callsError, appointmentsError })
  }
  
  return {
    totalLeads: totalLeads || 0,
    totalCalls: totalCalls || 0,
    scheduledAppointments: scheduledAppointments || 0
  }
}

async function LeadsContent() {
  const leads = await getLeadsWithCallCounts()
  const metrics = await getMetrics()
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Leads</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.totalLeads}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Call Attempts</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.totalCalls}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Scheduled Appointments</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.scheduledAppointments}</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Leads</h2>
          <Link href="/workspaces/leads/new">
            <Button>Add Lead</Button>
          </Link>
        </div>
        <DataTable columns={columns} data={leads} />
      </div>
    </>
  )
}

export default function LeadsPage() {
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <UsersIcon className="mr-2 h-6 w-6" />
          Leads Management
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your leads and track their progress
        </p>
      </div>
      
      <Suspense fallback={<div>Loading leads data...</div>}>
        <LeadsContent />
      </Suspense>
    </div>
  )
} 