import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

export interface Voice {
  id: string;
  provider: 'elevenlabs' | 'openai' | 'csm-1' | 'groq';
  voice_id: string;
  name: string;
  description: string | null;
  preview_url: string | null;
  created_at: string;
  updated_at: string;
}

export const VoiceService = {
  // Get all voices
  getVoices: async (): Promise<Voice[]> => {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('voices')
      .select('*')
      .order('provider', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get voice by ID
  getVoiceById: async (id: string): Promise<Voice> => {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('voices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get voices by provider
  getVoicesByProvider: async (provider: Voice['provider']): Promise<Voice[]> => {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase
      .from('voices')
      .select('*')
      .eq('provider', provider)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
}; 