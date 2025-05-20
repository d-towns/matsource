import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/callApi';

// Hook to fetch all call attempts
export function useCalls(teamId?: string) {
  return useQuery({
    queryKey: ['calls', teamId],
    queryFn: () => api.fetchCalls(teamId!),
    enabled: !!teamId,
  });
}

// Hook to add a new call attempt
export function useAddCall(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof api.addCall>[0]) => api.addCall(input, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calls', teamId] }),
  });
}

// Hook to fetch a single call attempt
export function useCall(id: string, teamId?: string) {
  return useQuery({
    queryKey: ['call', id, teamId],
    queryFn: () => api.fetchCall(id, teamId!),
    enabled: !!id && !!teamId,
  });
}

// Hook to update a call attempt
export function useUpdateCall(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof api.updateCallApi>[1] }) => api.updateCallApi(id, updates, teamId!),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['call', id, teamId] }),
  });
}

// Hook to delete a call attempt
export function useDeleteCall(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCallApi(id, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calls', teamId] }),
  });
}

export function useCallsWithLead(teamId?: string) {
  return useQuery({
    queryKey: ['calls', 'withLead', teamId],
    queryFn: () => api.fetchCallsWithLead(teamId!),
    enabled: !!teamId,
  });
  }

export function useCallWithLead(id: string, teamId?: string) {
  return useQuery({
    queryKey: ['call', 'withLead', id, teamId],
    queryFn: () => api.fetchCallWithLead(id, teamId!),
    enabled: !!id && !!teamId,
  });
}