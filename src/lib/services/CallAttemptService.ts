import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { CallAttempt, CallAttemptSchema } from '@/lib/models/callAttempt';

// Fetch all call attempts for the user's team
export async function getCalls(userId: string, teamId: string): Promise<CallAttempt[]> {
  const supabase = await createSupabaseSSRClient();
  console.log('teammmmmm' , teamId)
  const { data, error } = await supabase
    .from('call_attempts')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(d => CallAttemptSchema.parse(d));
}

// Fetch a single call attempt by ID
export async function getCallById(id: string, teamId: string): Promise<CallAttempt> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('call_attempts')
    .select('*')
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return CallAttemptSchema.parse(data);
}

// Create a new call attempt
export async function createCall(
  userId: string,
  teamId: string,
  input: Omit<Partial<CallAttempt>, 'id' | 'created_at' | 'updated_at' | 'team_id'> & { lead_id: string }
): Promise<CallAttempt> {
  const supabase = await createSupabaseSSRClient();
  const payload = {
    user_id: userId,
    team_id: teamId,
    ...input,
  };
  const { data, error } = await supabase
    .from('call_attempts')
    .insert(payload)
    .single();
  if (error) throw error;
  return CallAttemptSchema.parse(data);
}

// Update an existing call attempt
export async function updateCall(
  id: string,
  teamId: string,
  updates: Partial<Omit<CallAttempt, 'id' | 'created_at' | 'updated_at' | 'team_id'>>
): Promise<CallAttempt> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('call_attempts')
    .update(updates)
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return CallAttemptSchema.parse(data);
}

// Delete a call attempt by ID
export async function deleteCall(id: string, teamId: string): Promise<void> {
  const supabase = await createSupabaseSSRClient();
  const { error } = await supabase
    .from('call_attempts')
    .delete()
    .eq('id', id)
    .eq('team_id', teamId);
  if (error) throw error;
}

// Fetch all call attempts for a specific lead
export async function getCallsForLead(teamId: string, leadId: string): Promise<CallAttempt[]> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('call_attempts')
    .select('*')
    .eq('lead_id', leadId)
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(d => CallAttemptSchema.parse(d));
}

/**
 * Fetch all call attempts along with nested lead info for a user
 */
export async function getCallsWithLeadInfo(teamId: string) {
  const supabase = await createSupabaseSSRClient();
  const { data: calls, error } = await supabase
    .from('call_attempts')
    .select(`
      *,
      lead:lead_id (
        id,
        name,
        phone,
        email
      )
    `)
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return calls as any[]; // typed as CallAttemptWithLead[] in page
}

/**
 * Compute call metrics for a user
 */
export async function getCallMetrics(teamId: string) {
  const supabase = await createSupabaseSSRClient();

  const [{ count: totalCalls, error: totalErr }, { count: connectedCalls, error: connErr }, { count: scheduledCalls, error: schedErr }] =
    await Promise.all([
      supabase.from('call_attempts').select('*', { count: 'exact', head: true }).eq('team_id', teamId),
      supabase
        .from('call_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .neq('status', 'failed')
        .neq('status', 'no_answer')
        .neq('status', 'busy'),
      supabase
        .from('call_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .not('start_time', 'is', null),
    ]);

  if (totalErr || connErr || schedErr) {
    console.error('Error fetching call metrics:', { totalErr, connErr, schedErr });
  }

  const tc = totalCalls || 0;
  const cc = connectedCalls || 0;
  const sc = scheduledCalls || 0;
  const connectionRate = tc ? Math.round((cc / tc) * 100) : 0;

  return { totalCalls: tc, connectedCalls: cc, scheduledCalls: sc, connectionRate };
} 