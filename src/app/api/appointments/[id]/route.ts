import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsWithLead,
  getAppointmentsWithCallAttempt,
  getAppointmentsWithLeadAndCallAttempt,
} from '@/lib/services/AppointmentService';
import { AppointmentStatusEnum } from '@/lib/models/appointment';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { cookies } from 'next/headers';

const UpdateAppointmentSchema = z.object({
  lead_id: z.string().uuid().optional(),
  call_attempt_id: z.string().uuid().optional(),
  scheduled_time: z.string().optional(),
  duration: z.number().optional(),
  status: AppointmentStatusEnum.optional(),
  notes: z.string().optional(),
  reminder_sent: z.boolean().optional(),
  user_id: z.string().uuid().optional(),
  event_id: z.string().optional(),
  meeting_type: z.string().optional(),
  team_id: z.string().uuid().optional(),
  address: z.string().optional(),
});

// GET /api/appointments/:id - fetch a single appointment
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseSSRClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = (await params).id;
  const teamId = (await cookies()).get('activeTeam')?.value;
  if (!teamId) {
    return NextResponse.json({ error: 'No active team selected' }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('withLeadAndCallAttempt') === 'true') {
      const all = await getAppointmentsWithLeadAndCallAttempt(teamId);
      const appointment = all.find(a => a.id === id);
      if (!appointment) throw new Error('Not found');
      return NextResponse.json(appointment);
    }
    if (searchParams.get('withLead') === 'true') {
      const all = await getAppointmentsWithLead(teamId);
      const appointment = all.find(a => a.id === id);
      if (!appointment) throw new Error('Not found');
      return NextResponse.json(appointment);
    }
    if (searchParams.get('withCallAttempt') === 'true') {
      const all = await getAppointmentsWithCallAttempt(teamId);
      const appointment = all.find(a => a.id === id);
      if (!appointment) throw new Error('Not found');
      return NextResponse.json(appointment);
    }
    const appointment = await getAppointmentById(id, teamId);
    return NextResponse.json(appointment);
  } catch (err) {
    console.error('Error fetching appointment:', err);
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }
}

// PATCH /api/appointments/:id - update an appointment
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const parsed = UpdateAppointmentSchema.parse(await req.json());
    const id = (await params).id;
    const appointment = await updateAppointment(id, teamId, parsed);
    return NextResponse.json(appointment);
  } catch (err: unknown) {
    console.error('Error updating appointment:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// DELETE /api/appointments/:id - delete an appointment
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const id = (await params).id;
    await deleteAppointment(id, teamId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
} 