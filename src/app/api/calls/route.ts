import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCalls, createCall, getCallsWithLeadInfo } from '@/lib/services/CallAttemptService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { CallAttemptStatusEnum, CallResultEnum } from '@/lib/models/callAttempt';

// Schema for creating a call attempt
const CreateCallSchema = z.object({
  lead_id: z.string().uuid(),
  twilio_call_sid: z.string().optional(),
  end_time: z.string().optional(),
  duration: z.number().optional(),
  recording_url: z.string().optional(),
  transcript: z.array(z.object({ role: z.string(), content: z.string() })).optional(),
  result: CallResultEnum.optional(),
  notes: z.string().optional(),
  status: CallAttemptStatusEnum.optional(),
  to_number: z.string().optional(),
  teamId: z.string(),
});

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get('teamId');
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }
  try {
    const withLead = searchParams.get('withLead') === 'true';
    const calls = withLead
      ? await getCallsWithLeadInfo(teamId)
      : await getCalls(user.id, teamId);
    return NextResponse.json(calls);
  } catch (err) {
    console.error('Error fetching call attempts:', err);
    return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let parsed;
  try {
    parsed = CreateCallSchema.parse(await req.json());
  } catch (err) {
    console.error('Error parsing call attempt:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { lead_id, twilio_call_sid, end_time, duration, recording_url, transcript, result, notes, status, to_number, teamId } = parsed;
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }
  try {
    const call = await createCall(user.id, teamId, { lead_id, twilio_call_sid, end_time, duration, recording_url, transcript, result, notes, status, to_number });
    return NextResponse.json(call, { status: 201 });
  } catch (err: unknown) {
    console.error('Error creating call attempt:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create call' }, { status: 500 });
  }
} 