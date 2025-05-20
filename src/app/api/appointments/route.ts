import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getAppointments,
  createAppointment,
  getAppointmentsWithLead,
  getAppointmentsWithCallAttempt,
  getAppointmentsWithLeadAndCallAttempt,
} from '@/lib/services/AppointmentService';
import { AppointmentStatusEnum } from '@/lib/models/appointment';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

const CreateAppointmentSchema = z.object({
  lead_id: z.string().uuid(),
  call_attempt_id: z.string().uuid(),
  scheduled_time: z.string(),
  duration: z.number().optional(),
  status: AppointmentStatusEnum.optional(),
  notes: z.string().optional(),
  reminder_sent: z.boolean().optional(),
  user_id: z.string().uuid().optional(),
  event_id: z.string().optional(),
  meeting_type: z.string().optional(),
  teamId: z.string(),
  address: z.string().optional(),
});

// GET /api/appointments - list all appointments for the authenticated user
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get('teamId');
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }

  try {
    if (searchParams.get('withLeadAndCallAttempt') === 'true') {
      const appointments = await getAppointmentsWithLeadAndCallAttempt(teamId);
      return NextResponse.json(appointments);
    }
    if (searchParams.get('withLead') === 'true') {
      const appointments = await getAppointmentsWithLead(teamId);
      return NextResponse.json(appointments);
    }
    if (searchParams.get('withCallAttempt') === 'true') {
      const appointments = await getAppointmentsWithCallAttempt(teamId);
      return NextResponse.json(appointments);
    }
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

  let parsed;
  try {
    parsed = CreateAppointmentSchema.parse(await req.json());
  } catch (err) {
    console.error('Error parsing appointment:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { teamId, ...rest } = parsed;
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }

  try {
    // Ensure status is a valid enum value
    const appointment = await createAppointment(session.user.id, teamId, {
      ...rest,
      status: parsed.status ?? 'scheduled',
      lead_id: parsed.lead_id,
      call_attempt_id: parsed.call_attempt_id,
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (err: unknown) {
    console.error('Error creating appointment:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
} 