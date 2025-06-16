import { useQuery } from '@tanstack/react-query';
import { fetchVoices, fetchVoice, fetchVoicesByProvider } from '@/lib/api/voiceApi';
import { Voice } from '@/lib/services/VoiceService';

// Hook to fetch all voices
export function useVoices() {
  return useQuery({
    queryKey: ['voices'],
    queryFn: fetchVoices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch a single voice
export function useVoice(id: string) {
  return useQuery({
    queryKey: ['voices', id],
    queryFn: () => fetchVoice(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch voices by provider
export function useVoicesByProvider(provider: Voice['provider']) {
  return useQuery({
    queryKey: ['voices', 'provider', provider],
    queryFn: () => fetchVoicesByProvider(provider),
    enabled: !!provider,
    staleTime: 5 * 60 * 1000,
  });
} 