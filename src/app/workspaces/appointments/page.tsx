'use client'
import { Suspense } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/appointments/appointments-columns"
import { AppointmentWithLead } from "@/lib/models/appointment-shared"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAppointmentsWithLead } from '@/hooks/useAppointments'
import { useTeam } from '@/context/team-context'

function AppointmentsTable({ teamId }: { teamId: string }) {
  const { data: appointments, error } = useAppointmentsWithLead(teamId)
  if (error) return <p className="text-destructive font-sans">Error loading appointments: {error.message}</p>
  return <div className="rounded-lg border">
    <div className="flex items-center justify-between p-4">
      <h2 className="text-xl font-semibold font-sans">Appointments</h2>
      <Link href="/workspaces/appointments/new">
        <Button>Schedule Appointment</Button>
      </Link>
    </div>
    <DataTable columns={columns} data={appointments as AppointmentWithLead[] || []} />
  </div>
}

function AppointmentsSkeleton() {
  return <div className="h-40 w-full bg-muted rounded animate-pulse my-8" />
}

export default function AppointmentsPage() {
  const { activeTeam } = useTeam()
  if (!activeTeam?.id) {
    return <div className="text-muted-foreground font-sans">No team selected.</div>
  }
  return (
    <div className="container mx-auto py-4 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <CalendarIcon className="mr-2 h-6 w-6" />
          Appointments
        </h1>
        <p className="text-muted-foreground mt-1 font-normal">
          View and manage all appointments with your leads
        </p>
      </div>
      <Suspense fallback={<AppointmentsSkeleton />}>
        <AppointmentsTable teamId={activeTeam.id} />
      </Suspense>
    </div>
  )
} 