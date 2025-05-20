import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as formsApi from '@/lib/api/formsApi';
import { Form } from '@/lib/services/FormsService';

export function useForms(teamId?: string) {
  return useQuery<Form[]>({
    queryKey: ['forms', teamId],
    queryFn: () => formsApi.fetchForms(teamId!),
    enabled: !!teamId,
  });
}

export function useAddForm(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Form>) => formsApi.addForm(input, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['forms', teamId] }),
  });
}

export function useDeleteForm(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => formsApi.deleteForm(id, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['forms', teamId] }),
  });
} 