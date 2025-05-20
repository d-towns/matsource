import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { Agent, AgentSchema } from '@/lib/models/agent';

// Fetch all agents for a team


export const AgentService = {
    getAgents: async (teamId: string): Promise<Agent[]> => {
        const supabase = await createSupabaseSSRClient();
        const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((d: Agent) => AgentSchema.parse(d));
},

// Fetch a single agent by ID
getAgentById: async (id: string, teamId: string): Promise<Agent> => {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return AgentSchema.parse(data);
},

// Create a new agent
createAgent: async (
  userId: string,
  teamId: string,
  input: Omit<Partial<Agent>, 'id' | 'created_at' | 'updated_at' | 'team_id'> & { name: string; type: 'inbound_voice' | 'outbound_voice' | 'browser' }
): Promise<Agent> => {
  const supabase = await createSupabaseSSRClient();
  const payload = {
    user_id: userId,
    team_id: teamId,
    ...input,
  };
  const { data, error } = await supabase
    .from('agents')
    .insert(payload)
    .single();
  if (error) throw error;
  return AgentSchema.parse(data);
},

// Update an existing agent
updateAgent: async (
  id: string,
  teamId: string,
  updates: Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at' | 'team_id'>>
): Promise<Agent> => {
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from('agents')
    .update(updates)
    .eq('id', id)
    .eq('team_id', teamId)
    .single();
  if (error) throw error;
  return AgentSchema.parse(data);
},

// Delete an agent by ID
deleteAgent: async (id: string, teamId: string): Promise<void> => {
  const supabase = await createSupabaseSSRClient();
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id)
    .eq('team_id', teamId);
  if (error) throw error;
} 

}