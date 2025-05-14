import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/agentApi';
import { Agent } from '@/lib/models/agent';

// Hook to fetch all agents
export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: api.fetchAgents,
  });
}

// Hook to fetch a single agent
export function useAgent(id: string) {
  return useQuery<Agent>({
    queryKey: ['agent', id],
    queryFn: () => api.fetchAgent(id),
  });
}

// Hook to add a new agent
export function useAddAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.addAgent as (input: Omit<Partial<Agent>, 'id' | 'created_at' | 'updated_at' | 'team_id'> & { name: string; type: 'inbound_voice' | 'outbound_voice' | 'browser' }) => Promise<Agent>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agents'] }),
  });
}

// Hook to update an agent
export function useUpdateAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof api.updateAgentApi>[1] }) =>
      api.updateAgentApi(id, updates),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['agent', id] }),
  });
}

// Hook to delete an agent
export function useDeleteAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAgentApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agents'] }),
  });
} 