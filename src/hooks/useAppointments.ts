import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/appointmentApi';
import {
  AppointmentWithLead,
  AppointmentWithCallAttempt,
  AppointmentWithLeadAndCallAttempt,
} from '@/lib/models/appointment-shared';

// Hook to fetch all appointments
export function useAppointments(teamId?: string) {
  return useQuery({
    queryKey: ['appointments', teamId],
    queryFn: () => api.fetchAppointments(teamId!),
    enabled: !!teamId,
  });
}

// Hook to fetch all appointments with joined lead
export function useAppointmentsWithLead(teamId?: string) {
  return useQuery<AppointmentWithLead[]>({
    queryKey: ['appointments', 'withLead', teamId],
    queryFn: () => api.fetchAppointmentsWithLead(teamId!),
    enabled: !!teamId,
  });
}

// Hook to fetch all appointments with joined call attempt
export function useAppointmentsWithCallAttempt(teamId?: string) {
  return useQuery<AppointmentWithCallAttempt[]>({
    queryKey: ['appointments', 'withCallAttempt', teamId],
    queryFn: () => api.fetchAppointmentsWithCallAttempt(teamId!),
    enabled: !!teamId,
  });
}

// Hook to fetch all appointments with joined lead and call attempt
export function useAppointmentsWithLeadAndCallAttempt(teamId?: string) {
  return useQuery<AppointmentWithLeadAndCallAttempt[]>({
    queryKey: ['appointments', 'withLeadAndCallAttempt', teamId],
    queryFn: () => api.fetchAppointmentsWithLeadAndCallAttempt(teamId!),
    enabled: !!teamId,
  });
}

// Hook to add a new appointment
export function useAddAppointment(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof api.addAppointment>[0]) => api.addAppointment(input, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments', teamId] }),
  });
}

// Hook to fetch a single appointment
export function useAppointment(id: string, teamId?: string) {
  return useQuery({
    queryKey: ['appointment', id, teamId],
    queryFn: () => api.fetchAppointment(id, teamId!),
    enabled: !!id && !!teamId,
  });
}

// Hook to update an appointment
export function useUpdateAppointment(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof api.updateAppointmentApi>[1] }) =>
      api.updateAppointmentApi(id, updates, teamId!),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['appointment', id, teamId] }),
  });
}

// Hook to delete an appointment
export function useDeleteAppointment(teamId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAppointmentApi(id, teamId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments', teamId] }),
  });
}
