import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { Appointment, AppointmentSchema } from '@/lib/models/appointment';

// Fetch all appointments for a team
export async function getAppointments(teamId: string): Promise<Appointment[]> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('team_id', teamId)
    .order('scheduled_for', { ascending: false });
  if (error) throw error;
  return data.map(d => AppointmentSchema.parse(d));
}

// Fetch a single appointment by ID
export async function getAppointmentById(id: string, teamId: string): Promise<Appointment> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return AppointmentSchema.parse(data);
}

// Create a new appointment
export async function createAppointment(
  userId: string,
  teamId: string,
  input: { lead_id: string; scheduled_for: string; location?: string; notes?: string }
): Promise<Appointment> {
  const supabase = await createSupabaseSSRClient();
  const payload = {
    user_id: userId,
    team_id: teamId,
    ...input,
  };
  const { data, error } = await supabase
    .from('appointments')
    .insert(payload)
    .single();
  if (error) throw error;
  return AppointmentSchema.parse(data);
}

// Update an existing appointment
export async function updateAppointment(
  id: string,
  teamId: string,
  updates: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'team_id'>>
): Promise<Appointment> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return AppointmentSchema.parse(data);
}

// Delete an appointment by ID
export async function deleteAppointment(id: string, teamId: string): Promise<void> {
  const supabase = await createSupabaseSSRClient();
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
    .eq('team_id', teamId);
  if (error) throw error;
}

// Fetch appointments for a specific lead
export async function getAppointmentsForLead(
  teamId: string,
  leadId: string
): Promise<Appointment[]> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('lead_id', leadId)
    .eq('team_id', teamId)
    .order('scheduled_for', { ascending: false });
  if (error) throw error;
  return data.map(d => AppointmentSchema.parse(d));
} 