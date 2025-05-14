import { Suspense } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/appointments/appointments-columns"
import { AppointmentWithLead } from "@/lib/models/appointment-shared"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getAppointmentsWithLead } from "@/lib/services/AppointmentService"
import { cookies } from "next/headers"
// import { getAppointmentMetrics } from "@/lib/services/AppointmentService"
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