import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { Appointment, AppointmentSchema } from '@/lib/models/appointment';
import {
  AppointmentWithLead,
  AppointmentWithLeadSchema,
  AppointmentWithCallAttempt,
  AppointmentWithCallAttemptSchema,
  AppointmentWithLeadAndCallAttempt,
  AppointmentWithLeadAndCallAttemptSchema,
} from '@/lib/models/appointment-shared';

// Fetch all appointments for a team
export async function getAppointments(teamId: string): Promise<Appointment[]> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('team_id', teamId)
    .order('scheduled_time', { ascending: true });
  if (error) throw error;
  return (data || []).map((d: Appointment) => AppointmentSchema.parse(d));
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

// Fetch a single appointment by ID with joined lead info
export async function getAppointmentByIdWithLead(id: string, teamId: string): Promise<AppointmentWithLead> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*, lead:lead_id(*)')
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return AppointmentWithLeadSchema.parse(data);
}

// Fetch a single appointment by ID with joined call attempt info
export async function getAppointmentByIdWithCallAttempt(id: string, teamId: string): Promise<AppointmentWithCallAttempt> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*, call_attempt:call_attempt_id(*)')
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return AppointmentWithCallAttemptSchema.parse(data);
}

// Fetch a single appointment by ID with joined lead and call attempt info
export async function getAppointmentByIdWithLeadAndCallAttempt(id: string, teamId: string): Promise<AppointmentWithLeadAndCallAttempt> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*, lead:lead_id(*), call_attempt:call_attempt_id(*)')
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return AppointmentWithLeadAndCallAttemptSchema.parse(data);
} 



// Create a new appointment
export async function createAppointment(
  userId: string,
  teamId: string,
  input: Omit<Partial<Appointment>, 'id' | 'created_at' | 'updated_at' | 'team_id'> & { lead_id: string; call_attempt_id: string }
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

// Fetch all appointments with joined lead info
export async function getAppointmentsWithLead(teamId: string): Promise<AppointmentWithLead[]> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*, lead:lead_id(*)')
    .eq('team_id', teamId)
    .order('scheduled_time', { ascending: true });
  if (error) throw error;
  return (data || []).map((d: AppointmentWithLead) => AppointmentWithLeadSchema.parse(d));
}

// Fetch all appointments with joined call attempt info
export async function getAppointmentsWithCallAttempt(teamId: string): Promise<AppointmentWithCallAttempt[]> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*, call_attempt:call_attempt_id(*)')
    .eq('team_id', teamId)
    .order('scheduled_time', { ascending: true });
  if (error) throw error;
  return (data || []).map((d: AppointmentWithCallAttempt) => AppointmentWithCallAttemptSchema.parse(d));
}

// Fetch all appointments with both joined lead and call attempt info
export async function getAppointmentsWithLeadAndCallAttempt(teamId: string): Promise<AppointmentWithLeadAndCallAttempt[]> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('appointments')
    .select('*, lead:lead_id(*), call_attempt:call_attempt_id(*)')
    .eq('team_id', teamId)
    .order('scheduled_time', { ascending: true });
  if (error) throw error;
  return (data || []).map((d: AppointmentWithLeadAndCallAttempt) => AppointmentWithLeadAndCallAttemptSchema.parse(d));
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
// Fetch appointment metrics
export async function getAppointmentMetrics(teamId: string) {
  const supabase = await createSupabaseSSRClient()
  
  // Get total appointments count
  const { count: totalAppointments, error: totalError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)
  
  // Get upcoming appointments count (scheduled or confirmed, and in the future)
  const now = new Date().toISOString()
  const { count: upcomingAppointments, error: upcomingError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)
    .in('status', ['scheduled', 'confirmed'])
    .gt('scheduled_time', now)
  
  // Get completed appointments count
  const { count: completedAppointments, error: completedError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)
    .eq('status', 'completed')
  
  // Get cancelled/no-show appointments count
  const { count: missedAppointments, error: missedError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)
    .in('status', ['cancelled', 'no_show'])
  
  if (totalError || upcomingError || completedError || missedError) {
    console.error('Error fetching appointment metrics:', {
      totalError, upcomingError, completedError, missedError
    })
  }
  
  return {
    totalAppointments: totalAppointments || 0,
    upcomingAppointments: upcomingAppointments || 0,
    completedAppointments: completedAppointments || 0,
    missedAppointments: missedAppointments || 0
  }
}