import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/appointmentApi';
import { Appointment } from '@/lib/models/appointment';

// Hook to fetch all appointments
export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: api.fetchAppointments,
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