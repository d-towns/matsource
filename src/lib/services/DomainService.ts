import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { z } from 'zod';

// Zod schema
export const DomainSchema = z.object({
  id: z.string(),
  user_id: z.string().nullable().optional(),
  domain: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  team_id: z.string().nullable(),
});

export type Domain = z.infer<typeof DomainSchema>;

export const DomainService = {
  /**
   * Fetch all domains for a given team.
   */
  async getDomainsByTeam(teamId: string): Promise<Domain[]> {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .eq('team_id', teamId);
    if (error) throw error;
    return z.array(DomainSchema).parse(data);
  },

  /**
   * Create a new domain for a team and user.
   */
  async createDomain(domain: string, teamId: string, userId: string): Promise<Domain> {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('domains')
      .insert({ domain, team_id: teamId, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return DomainSchema.parse(data);
  },

  /**
   * Delete a domain by id and team.
   */
  async deleteDomain(domainId: string, teamId: string): Promise<void> {
    const supabase = await createSupabaseSSRClient();
    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', domainId)
      .eq('team_id', teamId);
    if (error) throw error;
  },
}; 