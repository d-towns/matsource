import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as domainsApi from '@/lib/api/domainsApi';
import { Domain } from '@/lib/services/DomainService';

export function useDomains(teamId?: string) {
  return useQuery<Domain[]>({
    queryKey: ['domains', teamId],
    queryFn: () => domainsApi.fetchDomains(teamId!),
    enabled: !!teamId,
  });
}

export function useAddDomain(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domain: string) => domainsApi.addDomain(domain, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['domains', teamId] }),
  });
}

export function useDeleteDomain(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => domainsApi.deleteDomain(id, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['domains', teamId] }),
  });
} 