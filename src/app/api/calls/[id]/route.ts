import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCallById, updateCall, deleteCall, getCallsWithLeadInfo } from '@/lib/services/CallAttemptService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { CallAttemptStatusEnum, CallResultEnum } from '@/lib/models/callAttempt';

// Schema for updating a call attempt
const UpdateCallSchema = z.object({
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

// GET /api/calls/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const id = (await params).id
    if (withLead) {
      const calls = await getCallsWithLeadInfo(teamId);
      const call = calls.find(c => c.id === id);
      if (!call) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(call);
    } else {
      const call = await getCallById(id, teamId);
      return NextResponse.json(call);
    }
  } catch (err) {
    console.error('Error fetching call attempt:', err);
    return NextResponse.json({ error: 'Failed to fetch call' }, { status: 500 });
  }
}

// PATCH /api/calls/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let parsed;
  try {
    parsed = UpdateCallSchema.parse(await req.json());
  } catch (err) {
    console.error('Error parsing call attempt:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { teamId, ...updates } = parsed;
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }
  try {
    const id = (await params).id
    const call = await updateCall(id, user.id, { ...updates, teamId });
    return NextResponse.json(call);
  } catch (err: unknown) {
    console.error('Error updating call attempt:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update call' }, { status: 500 });
  }
}

// DELETE /api/calls/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let teamId;
  try {
    const body = await req.json();
    teamId = body.teamId;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }
  try {
    const id = (await params).id
    await deleteCall(id, teamId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting call attempt:', err);
    return NextResponse.json({ error: 'Failed to delete call' }, { status: 500 });
  }
} 