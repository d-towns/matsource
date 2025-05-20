import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Zod schema
export const ApiKeySchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  key: z.string(),
  created_at: z.string(),
  last_used_at: z.string().nullable(),
  team_id: z.string().nullable(),
});

export type ApiKey = z.infer<typeof ApiKeySchema>;

export const ApiKeyService = {
  /**
   * Fetch all API keys for a given team.
   */
  async getApiKeysByTeam(teamId: string): Promise<ApiKey[]> {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('team_id', teamId);
    if (error) throw error;
    return z.array(ApiKeySchema).parse(data);
  },

  /**
   * Create a new API key for a user and team. Returns the id, name, and plain key.
   */
  async createApiKey(name: string, userId: string, teamId: string): Promise<{ id: string; name: string; key: string }> {
    if (!name || typeof name !== 'string') {
      throw new Error('Name is required');
    }
    const supabase = await createSupabaseSSRClient();
    // Generate API key
    const apiKey = `mk_${crypto.randomBytes(24).toString('hex')}`;
    // Hash the API key for storage
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    // Create a new API key record
    const { data: key, error } = await supabase
      .from('api_keys')
      .insert({
        id: uuidv4(),
        user_id: userId,
        team_id: teamId,
        name,
        key: hashedKey,
      })
      .select('id, name')
      .single();
    if (error) throw error;
    return {
      id: key.id,
      name: key.name,
      key: apiKey,
    };
  },

  /**
   * Delete an API key by id and team.
   */
  async deleteApiKey(apiKeyId: string, teamId: string): Promise<void> {
    const supabase = await createSupabaseSSRClient();
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', apiKeyId)
      .eq('team_id', teamId);
    if (error) throw error;
  },
}; 