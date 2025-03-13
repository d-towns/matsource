import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { CallAttemptWithLead } from "@/lib/models/leads"
import { 
  PhoneIcon, 
  MailIcon, 
  CalendarIcon, 
  ClockIcon,
  PhoneCallIcon,
  ArrowLeftIcon,
  FileTextIcon,
  UserIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import Link from "next/link"
import React from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Helper function to format duration in mm:ss
function formatDuration(seconds?: number): string {
  if (!seconds) return '00:00'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Helper function to render outcome badge
function getOutcomeBadge(outcome?: string) {
  const outcomeConfig: Record<string, { class: string, icon: React.ReactNode }> = {
    connected: { 
      class: "bg-green-100 text-green-800 border-green-200", 
      icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
    },
    voicemail: { 
      class: "bg-blue-100 text-blue-800 border-blue-200", 
      icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
    },
    no_answer: { 
      class: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
    },
    busy: { 
      class: "bg-orange-100 text-orange-800 border-orange-200", 
      icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
    },
    failed: { 
      class: "bg-red-100 text-red-800 border-red-200", 
      icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
    },
    appointment_scheduled: { 
      class: "bg-green-100 text-green-800 border-green-200", 
      icon: <CalendarIcon className="h-3 w-3 mr-1" /> 
    },
    declined: { 
      class: "bg-gray-100 text-gray-800 border-gray-200", 
      icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
    },
    follow_up: { 
      class: "bg-purple-100 text-purple-800 border-purple-200", 
      icon: <ClockIcon className="h-3 w-3 mr-1" /> 
    },
  }

  if (!outcome) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
        <PhoneCallIcon className="h-3 w-3 mr-1" /> In Progress
      </Badge>
    )
  }

  const config = outcomeConfig[outcome] || { 
    class: "bg-gray-100 text-gray-600 border-gray-200", 
    icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
  }
  
  return (
    <Badge variant="outline" className={config.class}>
      {config.icon} {outcome.replace('_', ' ')}
    </Badge>
  )
}

async function getCallById(id: string): Promise<CallAttemptWithLead | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
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
    .eq('id', id)
    .single()
  
  if (error || !data) {
    console.error('Error fetching call attempt:', error)
    return null
  }
  
  return data as CallAttemptWithLead
}

async function CallDetailContent({ id }: { id: string }) {
  const call = await getCallById(id)
  
  if (!call) {
    notFound()
  }
  
  return (
    <>
      <div className="mb-6">
        <Link href="/workspaces/calls">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Calls
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold">Call with {call.lead.name}</h1>
            <div className="mt-2">
              {getOutcomeBadge(call.outcome)}
              {call.started_at && (
                <span className="ml-3 text-sm text-muted-foreground">
                  {formatDistanceToNow(parseISO(call.started_at), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Link href={`/workspaces/leads/${call.lead_id}`}>
              <Button variant="outline">
                <UserIcon className="mr-2 h-4 w-4" />
                View Lead
              </Button>
            </Link>
            <Button>
              <PhoneCallIcon className="mr-2 h-4 w-4" />
              Call Again
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Call Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Status:</div>
                <div>{getOutcomeBadge(call.outcome)}</div>
              </div>
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Duration:</div>
                <div>{formatDuration(call.duration)}</div>
              </div>
              {call.call_sid && (
                <div className="flex items-start">
                  <div className="min-w-24 text-sm text-muted-foreground">Call SID:</div>
                  <div className="text-sm font-mono truncate max-w-36">{call.call_sid}</div>
                </div>
              )}
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
                <Link href={`/workspaces/leads/${call.lead_id}`} className="text-blue-600 hover:underline">
                  {call.lead.name}
                </Link>
              </div>
              <div className="flex items-center">
                <div className="min-w-24 text-sm text-muted-foreground">Phone:</div>
                <div className="flex items-center">
                  <PhoneIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  {call.lead.phone}
                </div>
              </div>
              {call.lead.email && (
                <div className="flex items-center">
                  <div className="min-w-24 text-sm text-muted-foreground">Email:</div>
                  <div className="flex items-center">
                    <MailIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    {call.lead.email}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Timing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {call.scheduled_time && (
                <div className="flex items-start">
                  <div className="min-w-24 text-sm text-muted-foreground">Scheduled:</div>
                  <div>
                    {format(parseISO(call.scheduled_time), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              )}
              {call.started_at && (
                <div className="flex items-start">
                  <div className="min-w-24 text-sm text-muted-foreground">Started:</div>
                  <div>
                    {format(parseISO(call.started_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              )}
              {call.ended_at && (
                <div className="flex items-start">
                  <div className="min-w-24 text-sm text-muted-foreground">Ended:</div>
                  <div>
                    {format(parseISO(call.ended_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              )}
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Created:</div>
                <div>
                  {format(parseISO(call.created_at), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {call.notes && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{call.notes}</p>
          </CardContent>
        </Card>
      )}
      
      {call.transcription && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <FileTextIcon className="h-4 w-4 mr-2" />
              Transcription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{call.transcription}</p>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default async function CallPage({params}: {params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-4">
      <Suspense fallback={<LoadingSpinner text="Loading call data..." fullPage />}>
        <CallDetailContent id={id} />
      </Suspense>
    </div>
  )
} 