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
});

// GET /api/leads/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const withCalls = searchParams.get('withCalls') === 'true';
    if (withCalls) {
      const teamId = (await import('next/headers')).cookies().then(c => c.get('activeTeam')?.value);
      if (!teamId) {
        return NextResponse.json({ error: 'No active team selected' }, { status: 400 });
      }
      const lead = await getLeadWithCallAttempts(params.id, await teamId);
      return NextResponse.json(lead);
    } else {
      const lead = await getLeadById(params.id, user.id);
      return NextResponse.json(lead);
    }
  } catch (err) {
    console.error('Error fetching lead:', err);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

// PATCH /api/leads/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const updates = UpdateLeadSchema.parse(await req.json());
    const lead = await updateLeadById(params.id, user.id, updates);
    return NextResponse.json(lead);
  } catch (err: any) {
    console.error('Error updating lead:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// DELETE /api/leads/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await deleteLeadById(params.id, user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting lead:', err);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
} 