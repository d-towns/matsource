import { useQuery } from '@tanstack/react-query';
import { fetchModels, fetchModel, fetchModelsByProvider, fetchModelsByTier, fetchModelsByProviderAndTier } from '@/lib/api/modelApi';
import { Model } from '@/lib/services/ModelService';

// Hook to fetch all models
export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: fetchModels,
    staleTime: 0, // Always consider data stale
    refetchOnMount: true, // Always refetch on mount
  });
}

// Hook to fetch a single model
export function useModel(id: string) {
  return useQuery({
    queryKey: ['model', id],
    queryFn: () => fetchModel(id),
    enabled: !!id,
    staleTime: 0, // Always consider data stale
    refetchOnMount: true, // Always refetch on mount
  });
}

// Hook to fetch models by provider
export function useModelsByProvider(provider: Model['provider']) {
  return useQuery({
    queryKey: ['models', 'provider', provider],
    queryFn: () => fetchModelsByProvider(provider),
    enabled: !!provider,
    staleTime: 0, // Always consider data stale
    refetchOnMount: true, // Always refetch on mount
  });
}

// Hook to fetch models by tier
export function useModelsByTier(tier: Model['tier']) {
  return useQuery({
    queryKey: ['models', 'tier', tier],
    queryFn: () => fetchModelsByTier(tier),
    enabled: !!tier,
    staleTime: 0, // Always consider data stale
    refetchOnMount: true, // Always refetch on mount
  });
}

// Hook to fetch models by provider and tier
export function useModelsByProviderAndTier(provider: Model['provider'], tier: Model['tier']) {
  return useQuery({
    queryKey: ['models', 'provider', provider, 'tier', tier],
    queryFn: () => fetchModelsByProviderAndTier(provider, tier),
    enabled: !!provider && !!tier,
    staleTime: 0, // Always consider data stale
    refetchOnMount: true, // Always refetch on mount
  });
} 