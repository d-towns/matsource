import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getLeads, createLead, getLeadWithCallAttempts, getLeadsWithCallCount } from '@/lib/services/LeadService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { cookies } from 'next/headers';

// Schema for creating a lead
const CreateLeadSchema = z.object({
  name: z.string().optional(),
  phone: z.string(),
  email: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/leads - list all leads for the authenticated user
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const {data: {session}} = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const teamId = (await cookies()).get('activeTeam')?.value;
  if (!teamId) {
    return NextResponse.json({ error: 'No active team selected' }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const withCallCount = searchParams.get('withCallCount') === 'true';
    if (withCallCount) {
      // Implement getLeadsWithCallCount in LeadService if needed
      const leads = await getLeadsWithCallCount(teamId);
      return NextResponse.json(leads);
      // return NextResponse.json([]); // Placeholder
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

  const teamId = (await cookies()).get('activeTeam')?.value;
  if (!teamId) {
    return NextResponse.json({ error: 'No active team selected' }, { status: 400 });
  }

  try {
    const parsed = CreateLeadSchema.parse(await req.json());
    const { name, phone, email, source, notes } = parsed;
    const lead = await createLead(session.user.id, teamId, { name, phone, email, source, notes });
    return NextResponse.json(lead, { status: 201 });
  } catch (err: any) {
    console.error('Error creating lead:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
} 