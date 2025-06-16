import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

export interface Model {
  id: string;
  provider: 'groq' | 'openai';
  model_name: string;
  tier: 'basic' | 'premium';
  name: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const ModelService = {
  // Get all models
  getModels: async (): Promise<Model[]> => {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('provider', { ascending: true })
      .order('model_name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get model by ID
  getModelById: async (id: string): Promise<Model> => {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get models by provider
  getModelsByProvider: async (provider: Model['provider']): Promise<Model[]> => {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('provider', provider)
      .order('model_name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get models by tier
  getModelsByTier: async (tier: Model['tier']): Promise<Model[]> => {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('tier', tier)
      .order('provider', { ascending: true })
      .order('model_name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
}; 