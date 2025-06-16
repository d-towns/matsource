import { Model } from '@/lib/services/ModelService';

// Fetch all models
export async function fetchModels(): Promise<Model[]> {
  const res = await fetch('/api/models', {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch models');
  const { models } = await res.json();
  return models;
}

// Fetch a single model
export async function fetchModel(id: string): Promise<Model> {
  const res = await fetch(`/api/models/${id}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch model');
  return await res.json();
}

// Fetch models by provider
export async function fetchModelsByProvider(provider: Model['provider']): Promise<Model[]> {
  const res = await fetch(`/api/models?provider=${encodeURIComponent(provider)}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch models');
  const { models } = await res.json();
  return models;
}

// Fetch models by tier
export async function fetchModelsByTier(tier: Model['tier']): Promise<Model[]> {
  const res = await fetch(`/api/models?tier=${encodeURIComponent(tier)}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch models');
  const { models } = await res.json();
  return models;
}

// Fetch models by provider and tier
export async function fetchModelsByProviderAndTier(provider: Model['provider'], tier: Model['tier']): Promise<Model[]> {
  const res = await fetch(`/api/models?provider=${encodeURIComponent(provider)}&tier=${encodeURIComponent(tier)}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch models');
  const { models } = await res.json();
  return models;
} 