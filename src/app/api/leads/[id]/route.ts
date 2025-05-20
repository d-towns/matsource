import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getLeadById, updateLeadById, deleteLeadById, getLeadWithCallAttempts } from '@/lib/services/LeadService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { LeadStatusEnum } from '@/lib/models/lead';

// Schema for updating a lead
const UpdateLeadSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  status: LeadStatusEnum.optional(),
  teamId: z.string(),
});

// GET /api/leads/[id]
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
    const id = (await params).id
    const withCalls = searchParams.get('withCalls') === 'true';
    if (withCalls) {
      const lead = await getLeadWithCallAttempts(id, teamId);
      return NextResponse.json(lead);
    } else {
      const lead = await getLeadById(id, teamId);
      return NextResponse.json(lead);
    }
  } catch (err) {
    console.error('Error fetching lead:', err);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

// PATCH /api/leads/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let parsed;
  try {
    parsed = UpdateLeadSchema.parse(await req.json());
  } catch (err) {
    console.error('Error parsing lead:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { teamId, ...updates } = parsed;
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }
  try {
    const id = (await params).id
    const lead = await updateLeadById(id, teamId, updates);
    return NextResponse.json(lead);
  } catch (err: unknown) {
    console.error('Error updating lead:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// DELETE /api/leads/[id]
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
    await deleteLeadById(id, teamId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting lead:', err);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
} 