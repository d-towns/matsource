import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { Partner, PartnerSchema } from '@/lib/models/partner';
import { Team } from '@/lib/models/team';

// Fetch a partner by id
export async function getPartnerById(partnerId: string): Promise<Partner | null> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', partnerId)
    .single();
  if (error) throw error;
  return data ? PartnerSchema.parse(data) : null;
}

// Fetch all teams for a partner
export async function getTeamsForPartner(partnerId: string): Promise<Team[]> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('partner_id', partnerId);
  if (error) throw error;
  return (data || []).map((d: unknown) => Team.parse(d));
}

// Create a team for a partner and add the creator to user_teams as 'owner'
export async function createTeamForPartner(partnerId: string, team: Omit<Team, 'id' | 'created_at'>, userId: string): Promise<Team> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('teams')
    .insert([{ ...team, partner_id: partnerId }])
    .select()
    .single();
  if (error) throw error;
  // Add the creator to user_teams as 'owner'
  const teamId = data.id;
  const { error: userTeamsError } = await supabase
    .from('user_teams')
    .insert([{ user_id: userId, team_id: teamId, role: 'owner' }]);
  if (userTeamsError) throw userTeamsError;
  return Team.parse(data);
} 

export async function getPartnerByDomain(domain: string): Promise<Partner | null> {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('white_label_origin', domain)
    .single();
  if (error) throw error;
  return data ? PartnerSchema.parse(data) : null;
}