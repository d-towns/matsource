import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/leadApi';

// Hook to fetch leads
export function useLeads(teamId?: string, withCallCount?: boolean) {
  const queryKey = ['leads', teamId, withCallCount];
  const queryFn = () => {
    if (withCallCount) {
      return api.fetchLeadsWithCallCount(teamId!);
    }
    return api.fetchLeads(teamId!);
  }
  return useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    enabled: !!teamId,
  });
}

// Hook to add a new lead
export function useAddLead(teamId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof api.addLead>[0]) => api.addLead(input, teamId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads', teamId] }),
  });
}

// Hook to fetch a single lead
export function useLead(id: string, teamId?: string) {
  return useQuery({
    queryKey: ['lead', id, teamId],
    queryFn: () => api.fetchLead(id, teamId!),
    enabled: !!id && !!teamId,
  });
}

// Hook to update a lead
export function useUpdateLead(teamId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof api.updateLead>[1] }) => api.updateLead(id, updates, teamId!),
    onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: ['lead', id, teamId] }),
  });
}

// Hook to delete a lead
export function useDeleteLead(teamId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteLead(id, teamId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads', teamId] }),
  });
}
