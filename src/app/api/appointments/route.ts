import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAppointments, createAppointment } from '@/lib/services/AppointmentService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { cookies } from 'next/headers';

const CreateAppointmentSchema = z.object({
  lead_id: z.string().uuid(),
  scheduled_for: z.string(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/appointments - list all appointments for the authenticated user
export async function GET(req: NextRequest) {
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
    const appointments = await getAppointments(teamId);
    return NextResponse.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// POST /api/appointments - create a new appointment
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
    const { lead_id, scheduled_for, location, notes } = CreateAppointmentSchema.parse(await req.json());
    const appointment = await createAppointment(session.user.id, teamId, { lead_id, scheduled_for, location, notes });
    return NextResponse.json(appointment, { status: 201 });
  } catch (err: any) {
    console.error('Error creating appointment:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
} 