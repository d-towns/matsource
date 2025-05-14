import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/appointmentApi';
import {
  AppointmentWithLead,
  AppointmentWithCallAttempt,
  AppointmentWithLeadAndCallAttempt,
} from '@/lib/models/appointment-shared';

// Hook to fetch all appointments
export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: api.fetchAppointments,
  });
}

// Hook to fetch all appointments with joined lead
export function useAppointmentsWithLead() {
  return useQuery<AppointmentWithLead[]>({
    queryKey: ['appointments', 'withLead'],
    queryFn: api.fetchAppointmentsWithLead,
  });
}

// Hook to fetch all appointments with joined call attempt
export function useAppointmentsWithCallAttempt() {
  return useQuery<AppointmentWithCallAttempt[]>({
    queryKey: ['appointments', 'withCallAttempt'],
    queryFn: api.fetchAppointmentsWithCallAttempt,
  });
}

// Hook to fetch all appointments with joined lead and call attempt
export function useAppointmentsWithLeadAndCallAttempt() {
  return useQuery<AppointmentWithLeadAndCallAttempt[]>({
    queryKey: ['appointments', 'withLeadAndCallAttempt'],
    queryFn: api.fetchAppointmentsWithLeadAndCallAttempt,
  });
}

// Hook to add a new appointment
export function useAddAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.addAppointment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}

// Hook to fetch a single appointment
export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => api.fetchAppointment(id),
  });
}

// Hook to update an appointment
export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof api.updateAppointmentApi>[1] }) =>
      api.updateAppointmentApi(id, updates),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['appointment', id] }),
  });
}

// Hook to delete an appointment
export function useDeleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAppointmentApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
} 