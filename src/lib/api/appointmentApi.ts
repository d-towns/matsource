import { Appointment } from '@/lib/models/appointment';
import {
  AppointmentWithLead,
  AppointmentWithCallAttempt,
  AppointmentWithLeadAndCallAttempt,
} from '@/lib/models/appointment-shared';

function checkStatus(res: Response) {
  if (!res.ok) throw new Error(res.statusText);
  return res;
}

// Fetch all appointments
export async function fetchAppointments(teamId: string): Promise<Appointment[]> {
  const res = await fetch(`/api/appointments?teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Fetch all appointments with joined lead
export async function fetchAppointmentsWithLead(teamId: string): Promise<AppointmentWithLead[]> {
  const res = await fetch(`/api/appointments?withLead=true&teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Fetch all appointments with joined call attempt
export async function fetchAppointmentsWithCallAttempt(teamId: string): Promise<AppointmentWithCallAttempt[]> {
  const res = await fetch(`/api/appointments?withCallAttempt=true&teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Fetch all appointments with joined lead and call attempt
export async function fetchAppointmentsWithLeadAndCallAttempt(teamId: string): Promise<AppointmentWithLeadAndCallAttempt[]> {
  const res = await fetch(`/api/appointments?withLeadAndCallAttempt=true&teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Create a new appointment
export async function addAppointment(
  input: { lead_id: string; call_attempt_id: string; scheduled_time: string; duration?: number; status?: string; notes?: string; reminder_sent?: boolean; user_id?: string; event_id?: string; meeting_type?: string; team_id?: string; address?: string },
  teamId: string
): Promise<Appointment> {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, teamId }),
  });
  checkStatus(res);
  return res.json();
}

// Fetch a single appointment
export async function fetchAppointment(id: string, teamId: string): Promise<Appointment> {
  const res = await fetch(`/api/appointments/${id}?teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Update an appointment
export async function updateAppointmentApi(
  id: string,
  updates: Partial<{ lead_id: string; call_attempt_id: string; scheduled_time: string; duration?: number; status?: string; notes?: string; reminder_sent?: boolean; user_id?: string; event_id?: string; meeting_type?: string; team_id?: string; address?: string }>,
  teamId: string
): Promise<Appointment> {
  const res = await fetch(`/api/appointments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...updates, teamId }),
  });
  checkStatus(res);
  return res.json();
}

// Delete an appointment
export async function deleteAppointmentApi(id: string, teamId: string): Promise<void> {
  const res = await fetch(`/api/appointments/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId }),
  });
  checkStatus(res);
} 