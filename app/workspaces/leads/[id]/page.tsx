import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/calls/calls-columns"
import { Lead, CallAttemptWithLead } from "@/lib/models/leads"
import { 
  PhoneIcon, 
  MailIcon, 
  CalendarIcon, 
  ClockIcon,
  PhoneCallIcon,
  ArrowLeftIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Helper function to render status badge, similar to the one in leads-columns.tsx
function getStatusBadge(status: string) {
  const statusConfig: Record<string, { class: string, icon: React.ReactNode }> = {
    new: { 
      class: "bg-blue-100 text-blue-800 border-blue-200", 
      icon: <ClockIcon className="h-3 w-3 mr-1" /> 
    },
    contacted: { 
      class: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
    },
    in_progress: { 
      class: "bg-purple-100 text-purple-800 border-purple-200", 
      icon: <ClockIcon className="h-3 w-3 mr-1" /> 
    },
    appointment_scheduled: { 
      class: "bg-green-100 text-green-800 border-green-200", 
      icon: <CalendarIcon className="h-3 w-3 mr-1" /> 
    },
    qualified: { 
      class: "bg-teal-100 text-teal-800 border-teal-200", 
      icon: <ClockIcon className="h-3 w-3 mr-1" /> 
    },
    unqualified: { 
      class: "bg-gray-100 text-gray-800 border-gray-200", 
      icon: <ClockIcon className="h-3 w-3 mr-1" /> 
    },
    closed: { 
      class: "bg-green-500 text-white border-green-600", 
      icon: <ClockIcon className="h-3 w-3 mr-1" /> 
    },
  }

  const config = statusConfig[status] || statusConfig.new
  
  return (
    <Badge variant="outline" className={config.class}>
      {config.icon} {status.replace('_', ' ')}
    </Badge>
  )
}

async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !data) {
    console.error('Error fetching lead:', error)
    return null
  }
  
  return data as Lead
}

async function getCallsForLead(leadId: string): Promise<CallAttemptWithLead[]> {
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
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching call attempts for lead:', error)
    return []
  }
  
  return data as CallAttemptWithLead[]
}

async function LeadDetailContent({ id }: { id: string }) {
  const lead = await getLeadById(id)
  
  if (!lead) {
    notFound()
  }
  
  const calls = await getCallsForLead(id)
  
  return (
    <>
      <div className="mb-6">
        <Link href="/workspaces/leads">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Leads
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold">{lead.name}</h1>
            {lead.status && (
              <div className="mt-2">
                {getStatusBadge(lead.status)}
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline">
              <PhoneCallIcon className="mr-2 h-4 w-4" />
              Call Now
            </Button>
            <Button>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Call
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center">
                  <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{lead.email}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Lead Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Source:</div>
                <div>{lead.source || 'Unknown'}</div>
              </div>
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Created:</div>
                <div>
                  {format(parseISO(lead.created_at), 'MMM d, yyyy')}
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(parseISO(lead.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Call Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Total Calls:</div>
                <div>{calls.length}</div>
              </div>
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Last Call:</div>
                <div>
                  {calls.length > 0 && calls[0].started_at ? (
                    <>
                      {format(parseISO(calls[0].started_at), 'MMM d, yyyy')}
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(parseISO(calls[0].started_at), { addSuffix: true })}
                      </div>
                    </>
                  ) : (
                    'No calls yet'
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {lead.notes && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{lead.notes}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="rounded-lg border">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold flex items-center">
            <PhoneCallIcon className="mr-2 h-4 w-4" />
            Call History
          </h2>
          <Link href={`/workspaces/calls/new?lead=${lead.id}`}>
            <Button size="sm">Schedule Call</Button>
          </Link>
        </div>
        {calls.length > 0 ? (
          <DataTable columns={columns} data={calls} />
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No call attempts yet. Schedule your first call with this lead.
          </div>
        )}
      </div>
    </>
  )
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-4">
      <Suspense fallback={<LoadingSpinner text="Loading lead data..." fullPage />}>
        <LeadDetailContent id={id} />
      </Suspense>
    </div>
  )
} 