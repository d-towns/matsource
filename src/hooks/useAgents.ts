import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/agentApi';
import { Agent } from '@/lib/models/agent';

// Hook to fetch all agents
export function useAgents(teamId?: string) {
  return useQuery<Agent[]>({
    queryKey: ['agents', teamId],
    queryFn: () => api.fetchAgents(teamId!),
    enabled: !!teamId,
  });
}

// Hook to fetch a single agent
export function useAgent(id: string, teamId?: string) {
  return useQuery<Agent>({
    queryKey: ['agent', id, teamId],
    queryFn: () => api.fetchAgent(id, teamId!),
    enabled: !!id && !!teamId,
  });
}

// Hook to add a new agent
export function useAddAgent(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Partial<Agent>, 'id' | 'created_at' | 'updated_at' | 'team_id'> & { name: string; type: 'inbound_voice' | 'outbound_voice' | 'browser' }) => api.addAgent(input, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agents', teamId] }),
  });
}

// Hook to update an agent
export function useUpdateAgent(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof api.updateAgentApi>[1] }) =>
      api.updateAgentApi(id, updates, teamId!),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['agent', id, teamId] }),
  });
}

// Hook to delete an agent
export function useDeleteAgent(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAgentApi(id, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agents', teamId] }),
  });
} 