import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Appointment } from "@/lib/models/appointments"
import { 
  PhoneIcon, 
  MailIcon, 
  CalendarIcon, 
  ClockIcon,
  ArrowLeftIcon,
  FileTextIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Status badge configuration
const statusConfig: Record<string, { class: string, icon: React.ReactNode }> = {
  scheduled: { 
    class: "bg-blue-100 text-blue-800 border-blue-200", 
    icon: <CalendarIcon className="h-3 w-3 mr-1" /> 
  },
  confirmed: { 
    class: "bg-purple-100 text-purple-800 border-purple-200", 
    icon: <CheckCircleIcon className="h-3 w-3 mr-1" /> 
  },
  completed: { 
    class: "bg-green-100 text-green-800 border-green-200", 
    icon: <CheckCircleIcon className="h-3 w-3 mr-1" /> 
  },
  cancelled: { 
    class: "bg-red-100 text-red-800 border-red-200", 
    icon: <XCircleIcon className="h-3 w-3 mr-1" /> 
  },
  no_show: { 
    class: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: <ClockIcon className="h-3 w-3 mr-1" /> 
  }
}

async function getAppointmentById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      lead:lead_id (
        id,
        name,
        phone,
        email
      ),
      call_attempt:call_attempt_id (
        id,
        started_at,
        ended_at,
        status,
        outcome
      )
    `)
    .eq('id', id)
    .single()
  
  if (error || !data) {
    console.error('Error fetching appointment:', error)
    return null
  }
  
  return data as Appointment
}

async function AppointmentDetailContent({ id }: { id: string }) {
  const appointment = await getAppointmentById(id)
  
  if (!appointment) {
    notFound()
  }
  
  const isPast = new Date(appointment.scheduled_time) < new Date()
  
  return (
    <>
      <div className="mb-6">
        <Link href="/workspaces/appointments">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Appointments
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Appointment with {appointment.lead.name}
            </h1>
            <div className="mt-2">
              {statusConfig[appointment.status] && (
                <Badge variant="outline" className={statusConfig[appointment.status].class}>
                  {statusConfig[appointment.status].icon} {appointment.status.replace('_', ' ')}
                </Badge>
              )}
              <span className="ml-3 text-sm text-muted-foreground">
                {formatDistanceToNow(parseISO(appointment.scheduled_time), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Link href={`/workspaces/leads/${appointment.lead_id}`}>
              <Button variant="outline">
                <UserIcon className="mr-2 h-4 w-4" />
                View Lead
              </Button>
            </Link>
            {!isPast && appointment.status !== 'cancelled' && (
              <Button variant="outline">
                <PhoneIcon className="mr-2 h-4 w-4" />
                Call Lead
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Date:</div>
                <div>{format(parseISO(appointment.scheduled_time), "MMMM d, yyyy")}</div>
              </div>
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Time:</div>
                <div>{format(parseISO(appointment.scheduled_time), "h:mm a")}</div>
              </div>
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Duration:</div>
                <div>{appointment.duration} minutes</div>
              </div>
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Status:</div>
                <div>
                  {statusConfig[appointment.status] && (
                    <Badge variant="outline" className={statusConfig[appointment.status].class}>
                      {statusConfig[appointment.status].icon} {appointment.status.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Reminder:</div>
                <div>{appointment.reminder_sent ? 'Sent' : 'Not sent'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Lead Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Name:</div>
                <Link href={`/workspaces/leads/${appointment.lead_id}`} className="text-blue-600 hover:underline">
                  {appointment.lead.name}
                </Link>
              </div>
              <div className="flex items-center">
                <div className="min-w-24 text-sm text-muted-foreground">Phone:</div>
                <div className="flex items-center">
                  <PhoneIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  {appointment.lead.phone}
                </div>
              </div>
              {appointment.lead.email && (
                <div className="flex items-center">
                    <MailIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    {appointment.lead.email}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function AppointmentDetailPage({ id }: { id: string }) {
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <CalendarIcon className="mr-2 h-6 w-6" />
          Appointment Details
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all appointments with your leads
        </p>
      </div>
      
      <Suspense fallback={<LoadingSpinner text="Loading appointment details..." fullPage />}>
        <AppointmentDetailContent id={id} />
      </Suspense>
    </div>
  )
} 