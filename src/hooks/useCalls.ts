import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/callApi';

// Hook to fetch all call attempts
export function useCalls() {
  return useQuery({
    queryKey: ['calls'],
    queryFn: api.fetchCalls,
  });
}

// Hook to add a new call attempt
export function useAddCall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.addCall,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calls'] }),
  });
}

// Hook to fetch a single call attempt
export function useCall(id: string) {
  return useQuery({
    queryKey: ['call', id],
    queryFn: () => api.fetchCall(id),
  });
}

// Hook to update a call attempt
export function useUpdateCall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof api.updateCallApi>[1] }) => api.updateCallApi(id, updates),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['call', id] }),
  });
}

// Hook to delete a call attempt
export function useDeleteCall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCallApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calls'] }),
  });
} 