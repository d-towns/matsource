import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/phoneNumberApi';
import { PhoneNumber } from '@/lib/models/phone_number';
import { CallerIdVerificationResult } from '@/lib/services/PhoneNumberService';

// Hook to fetch all phone numbers
export function usePhoneNumbers(teamId?: string) {
  return useQuery<PhoneNumber[]>({
    queryKey: ['phoneNumbers', teamId],
    queryFn: () => api.fetchPhoneNumbers(teamId!),
    enabled: !!teamId,
  });
}

// Hook to fetch a single phone number
export function usePhoneNumber(id: string, teamId?: string) {
  return useQuery<CallerIdVerificationResult>({
    queryKey: ['phoneNumber', id, teamId],
    queryFn: () => api.fetchPhoneNumber(id, teamId!),
    enabled: !!id && !!teamId,
    // Poll every 10 seconds if status is pending, otherwise use default behavior
    refetchInterval: (query) => {
      return query.state.data?.status === 'pending' ? 10000 : false;
    },
    // Stop polling when window is not focused to reduce unnecessary requests
    refetchIntervalInBackground: false,
  });
}

// Hook to create a new phone number verification
export function useCreatePhoneNumber(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof api.createPhoneNumber>[0]) => 
      api.createPhoneNumber(input, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['phoneNumbers', teamId] }),
  });
}

// Hook to retry phone number verification
export function useRetryVerification(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.retryPhoneNumberVerification(id, teamId!),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['phoneNumber', id, teamId] });
      qc.invalidateQueries({ queryKey: ['phoneNumbers', teamId] });
    },
  });
}

// Hook to delete a phone number
export function useDeletePhoneNumber(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deletePhoneNumber(id, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['phoneNumbers', teamId] }),
  });
} 