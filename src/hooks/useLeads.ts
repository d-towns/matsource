import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/leadApi';

// Hook to fetch leads
export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: api.fetchLeads,
  });
}

// Hook to add a new lead
export function useAddLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addLead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });
}

// Hook to fetch a single lead
export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => api.fetchLead(id),
  });
}

// Hook to update a lead
export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof api.updateLead>[1] }) => api.updateLead(id, updates),
    onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: ['lead', id] }),
  });
}

// Hook to delete a lead
export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteLead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });
} 