import { Suspense } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/appointments/appointments-columns"
import { useAppointmentsWithLead } from "@/hooks/useAppointments"
import { AppointmentWithLead } from "@/lib/models/appointment-shared"
import { CalendarIcon, XCircleIcon, CheckCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getAppointmentsWithLead } from "@/lib/services/AppointmentService"
import { cookies } from "next/headers"
import { createSupabaseSSRClient } from "@/lib/supabase/ssr"

// Fetch appointment metrics
async function getAppointmentMetrics() {
  const supabase = await createSupabaseSSRClient()
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

function AppointmentsContent({ appointments }: { appointments: AppointmentWithLead[] }) {
  // Metrics fetching can be refactored to a hook if needed
  // const metrics = useAppointmentMetrics()

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <Link href="/workspaces/appointments/new">
          <Button>Schedule Appointment</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={appointments as AppointmentWithLead[]} />
    </div>
  )
}

export default async function AppointmentsPage() {
  const cookieStore = await cookies()
  const teamId = cookieStore.get('activeTeam')?.value;
  const appointments = await getAppointmentsWithLead(teamId)
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
        <AppointmentsContent appointments={appointments} />
      </Suspense>
    </div>
  )
} 