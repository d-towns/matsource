import { Voice } from '@/lib/services/VoiceService';

// Fetch all voices
export async function fetchVoices(): Promise<Voice[]> {
  const res = await fetch('/api/voices');
  if (!res.ok) throw new Error('Failed to fetch voices');
  const { voices } = await res.json();
  return voices;
}

// Fetch a single voice
export async function fetchVoice(id: string): Promise<Voice> {
  const res = await fetch(`/api/voices/${id}`);
  if (!res.ok) throw new Error('Failed to fetch voice');
  return await res.json();
}

// Fetch voices by provider
export async function fetchVoicesByProvider(provider: Voice['provider']): Promise<Voice[]> {
  const res = await fetch(`/api/voices?provider=${encodeURIComponent(provider)}`);
  if (!res.ok) throw new Error('Failed to fetch voices');
  const { voices } = await res.json();
  return voices;
} 