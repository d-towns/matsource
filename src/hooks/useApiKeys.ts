import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as apiKeysApi from '@/lib/api/apiKeysApi';

export function useApiKeys(teamId?: string) {
  return useQuery({
    queryKey: ['api-keys', teamId],
    queryFn: () => apiKeysApi.fetchApiKeys(teamId!),
    enabled: !!teamId,
  });
}

export function useAddApiKey(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => apiKeysApi.addApiKey(name, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys', teamId] }),
  });
}

export function useDeleteApiKey(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiKeysApi.deleteApiKey(id, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys', teamId] }),
  });
} 