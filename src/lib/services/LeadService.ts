import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { Lead, LeadSchema } from '@/lib/models/lead';
import { LeadWithCallAttempts, LeadWithCallAttemptsSchema } from '@/lib/models/lead-callAttempt-shared';
import { LeadWithCallCount, LeadWithCallCountSchema } from '@/lib/models/lead-callAttempt-shared';

// Fetch all leads associated with the current user's team
export async function getLeads(teamId: string): Promise<Lead[]> {
  const supabase = await createSupabaseSSRClient();
  console.log('teamId in getLeads', teamId)
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('team_id', teamId)
    console.log(data)
  if (error) throw error;
  console.log('data', data);
  return data.map(d => LeadSchema.parse(d));
}

// Fetch a single lead by its ID, ensuring the requesting user owns it
export async function getLeadById(id: string, teamId: string): Promise<Lead> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return LeadSchema.parse(data);
}

// Create a new lead for the user's team
export async function createLead(
  userId: string,
  teamId: string,
  input: { name?: string; phone: string; email?: string; source?: string; notes?: string }
): Promise<Lead> {
  const supabase = await createSupabaseSSRClient();
  const payload = {
    user_id: userId,
    team_id: teamId,
    ...input,
  };
  const { data, error } = await supabase
    .from('leads')
    .insert(payload)
    .single();
  if (error) throw error;
  return LeadSchema.parse(data);
}

// Update an existing lead; only fields provided in `updates` will be modified
export async function updateLeadById(
  id: string,
  userId: string,
  updates: Partial<Pick<Lead, 'name' | 'phone' | 'email' | 'source' | 'notes' | 'status'>>
): Promise<Lead> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return LeadSchema.parse(data);
}

// Delete a lead by ID, ensuring the requesting user owns it
export async function deleteLeadById(id: string, userId: string): Promise<void> {
  const supabase = await createSupabaseSSRClient();
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function getLeadWithCallAttempts(id: string, teamId: string): Promise<LeadWithCallAttempts> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*, call_attempts(*)')
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return LeadWithCallAttemptsSchema.parse(data);
}

export async function getLeadsWithCallCount(teamId: string): Promise<LeadWithCallCount[]> {
  const supabase = await createSupabaseSSRClient();
  // Use a custom SQL query for aggregation
  const { data, error } = await supabase.rpc('leads_with_call_count', { team_id: teamId });
  if (error) throw error;
  return (data || []).map((d: any) => LeadWithCallCountSchema.parse(d));
} 