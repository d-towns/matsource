import { Suspense } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/appointments/appointments-columns"
import { createClient } from "@/utils/supabase/server"
import { Appointment } from "@/lib/models/appointments"
import { CalendarIcon, XCircleIcon, CheckCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Fetch appointments with lead information
async function getAppointmentsWithLeadInfo() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get all appointments with lead information
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      lead:lead_id (
        id,
        name,
        phone,
        email
      )
    `)
    .eq('user_id', user.id)
    .order('scheduled_time', { ascending: true })
  
  if (error) {
    console.error('Error fetching appointments:', error)
    return []
  }
  
  return appointments as Appointment[]
}

// Fetch appointment metrics
async function getAppointmentMetrics() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get total appointments count
  const { count: totalAppointments, error: totalError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
  
  // Get upcoming appointments count (scheduled or confirmed, and in the future)
  const now = new Date().toISOString()
  const { count: upcomingAppointments, error: upcomingError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['scheduled', 'confirmed'])
    .gt('scheduled_time', now)
  
  // Get completed appointments count
  const { count: completedAppointments, error: completedError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed')
  
  // Get cancelled/no-show appointments count
  const { count: missedAppointments, error: missedError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['cancelled', 'no_show'])
  
  if (totalError || upcomingError || completedError || missedError) {
    console.error('Error fetching appointment metrics:', {
      totalError, upcomingError, completedError, missedError
    })
  }
  
  return {
    totalAppointments: totalAppointments || 0,
    upcomingAppointments: upcomingAppointments || 0,
    completedAppointments: completedAppointments || 0,
    missedAppointments: missedAppointments || 0
  }
}

async function AppointmentsContent() {
  const appointments = await getAppointmentsWithLeadInfo()
  const metrics = await getAppointmentMetrics()
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Appointments</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.totalAppointments}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Upcoming</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.upcomingAppointments}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Completed</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.completedAppointments}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2">
            <XCircleIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Cancelled/No-show</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{metrics.missedAppointments}</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Appointments</h2>
          <Link href="/workspaces/appointments/new">
            <Button>Schedule Appointment</Button>
          </Link>
        </div>
        <DataTable columns={columns} data={appointments} />
      </div>
    </>
  )
}

export default function AppointmentsPage() {
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <CalendarIcon className="mr-2 h-6 w-6" />
          Appointments
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all appointments with your leads
        </p>
      </div>
      
      <Suspense fallback={<LoadingSpinner text="Loading appointments data..." fullPage />}>
        <AppointmentsContent />
      </Suspense>
    </div>
  )
} 