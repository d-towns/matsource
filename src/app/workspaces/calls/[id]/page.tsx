import { notFound } from 'next/navigation';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/calls/calls-columns';
import { getCallById, getCallsForLead } from '@/lib/services/CallAttemptService';
import { getLeadById } from '@/lib/services/LeadService';
import {
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  PhoneCallIcon,
  ArrowLeftIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import { cookies } from 'next/headers';

// Render status badge
function getStatusBadge(status?: string) {
  const config: Record<string, { class: string; icon: React.ReactNode }> = {
    connected: { class: 'bg-green-100 text-green-800 border-green-200', icon: <PhoneIcon className="h-3 w-3 mr-1" /> },
    voicemail: { class: 'bg-blue-100 text-blue-800 border-blue-200', icon: <PhoneIcon className="h-3 w-3 mr-1" /> },
    no_answer: { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <PhoneIcon className="h-3 w-3 mr-1" /> },
    busy: { class: 'bg-orange-100 text-orange-800 border-orange-200', icon: <PhoneIcon className="h-3 w-3 mr-1" /> },
    failed: { class: 'bg-red-100 text-red-800 border-red-200', icon: <PhoneIcon className="h-3 w-3 mr-1" /> },
    appointment_scheduled: { class: 'bg-green-100 text-green-800 border-green-200', icon: <CalendarIcon className="h-3 w-3 mr-1" /> },
    declined: { class: 'bg-gray-100 text-gray-800 border-gray-200', icon: <PhoneIcon className="h-3 w-3 mr-1" /> },
    follow_up: { class: 'bg-purple-100 text-purple-800 border-purple-200', icon: <ClockIcon className="h-3 w-3 mr-1" /> },
    pending: { class: 'bg-gray-100 text-gray-600 border-gray-200', icon: <ClockIcon className="h-3 w-3 mr-1" /> },
  };
  const badge = config[status || 'pending'] || config['pending'];
  return <Badge variant="outline" className={badge.class}>{badge.icon} {status?.replace('_', ' ')}</Badge>;
}

export default async function CallPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const cookieStore = await cookies();
  const teamId = cookieStore.get('activeTeam')?.value;
  if (!teamId) notFound();

  const id = (await params).id;
  const call = await getCallById(id, teamId);
  if (!call) notFound();

  const lead = await getLeadById(call.lead_id, teamId);
  // console.log('lead:', lead)
  if (!lead) notFound();
  console.log(teamId)
  const history = await getCallsForLead(teamId, call.lead_id);

  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <Link href="/workspaces/calls">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Calls
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold">Call with {lead.name}</h1>
            <div className="mt-2">
              {getStatusBadge(call.status)}
              {call.start_time && (
                <span className="ml-3 text-sm text-muted-foreground">
                  {formatDistanceToNow(parseISO(call.start_time), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Link href={`/workspaces/leads/${call.lead_id}`}>
              <Button variant="outline"><PhoneCallIcon className="mr-2 h-4 w-4" /> View Lead</Button>
            </Link>
            <Button><PhoneCallIcon className="mr-2 h-4 w-4" /> Call Again</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Call Details</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Status:</div>
                <div>{getStatusBadge(call.status)}</div>
              </div>
              <div className="flex items-start">
                <div className="min-w-24 text-sm text-muted-foreground">Started:</div>
                <div>{format(parseISO(call.start_time), 'MMM d, yyyy h:mm a')}</div>
              </div>
              {call.end_time && (
                <div className="flex items-start">
                  <div className="min-w-24 text-sm text-muted-foreground">Ended:</div>
                  <div>{format(parseISO(call.end_time), 'MMM d, yyyy h:mm a')}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>History</CardTitle></CardHeader>
          <CardContent>
            <DataTable columns={columns} data={history} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 