import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAppointmentById, updateAppointment, deleteAppointment } from '@/lib/services/AppointmentService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { cookies } from 'next/headers';

const UpdateAppointmentSchema = z.object({
  scheduled_for: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/appointments/:id - fetch a single appointment
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
    const appointment = await getAppointmentById(params.id, teamId);
    return NextResponse.json(appointment);
  } catch (err) {
    console.error('Error fetching appointment:', err);
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }
}

// PATCH /api/appointments/:id - update an appointment
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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
    const appointment = await updateAppointment(params.id, teamId, parsed);
    return NextResponse.json(appointment);
  } catch (err: any) {
    console.error('Error updating appointment:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// DELETE /api/appointments/:id - delete an appointment
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
    await deleteAppointment(params.id, teamId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
} 