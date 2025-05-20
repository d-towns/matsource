import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getLeads, createLead, getLeadsWithCallCount } from '@/lib/services/LeadService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

// Schema for creating a lead
const CreateLeadSchema = z.object({
  name: z.string().optional(),
  phone: z.string(),
  email: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  teamId: z.string(),
});

// GET /api/leads - list all leads for the authenticated user
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const {data: {session}} = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get('teamId');
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }

  try {
    const withCallCount = searchParams.get('withCallCount') === 'true';
    if (withCallCount) {
      const leads = await getLeadsWithCallCount(teamId);
      return NextResponse.json(leads);
    }
    // Default: get all leads
    const leads = await getLeads(teamId);
    return NextResponse.json(leads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/leads - create a new lead for the authenticated user
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let parsed;
  try {
    parsed = CreateLeadSchema.parse(await req.json());
  } catch (err) {
    console.error('Error parsing lead:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { name, phone, email, source, notes, teamId } = parsed;
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }

  try {
    const lead = await createLead(session.user.id, teamId, { name, phone, email, source, notes });
    return NextResponse.json(lead, { status: 201 });
  } catch (err: unknown) {
    console.error('Error creating lead:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
} 