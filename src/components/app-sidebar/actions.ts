'use server'

import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { Team } from "@/lib/models/team";

export async function getUserTeams(userId: string): Promise<Team | null> {
  // Create server-side Supabase client with cookie forwarding
  const supabase = await createSupabaseSSRClient();

  // Revalidate JWT and get the authenticated user
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session) {
    console.error('Auth error fetching user in getUserTeams:', authError);
    return null;
  }

  // Call the database function to get the team for this user under RLS
  const { data: teamData, error: rpcError } = await supabase
    .rpc('get_user_teams')

  if (rpcError || !teamData) {
    console.error('RPC error in getUserTeams:', rpcError);
    return null;
  }

  console.log('teamData ', teamData)
  // Parse and return the team record
  try {
    return Team.parse(teamData[0] as unknown);
  } catch (e) {
    console.error('Team parsing error in getUserTeams:', e);
    return null;
  }
}