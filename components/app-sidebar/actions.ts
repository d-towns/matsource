'use server'

import { createClient } from "@/utils/supabase/server";
import { Team } from "@/lib/models/team";

export async function getUserTeams(userId: string) : Promise<Team | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
  .from('users')
  .select('team:teams!users_team_id_fkey(*)')
  .eq('id', userId);
  console.log("data", data);
  return data?.[0].team as Team


//   const { data, error } = await supabase
//   .from('users')
//   .select('team_id')
//   .eq('id', userId);

//   console.log("data", data?.[0].team_id);
//   const teamId = data?.[0].team_id;

//   const { data: teams, error: teamsError } = await supabase
//   .from('teams')
//   .select('*')
//   .eq('id', teamId);

//   console.log("teams", teams);
//   return teams;
}