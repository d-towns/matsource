import { Appointment } from '@/lib/models/appointment';

function checkStatus(res: Response) {
  if (!res.ok) throw new Error(res.statusText);
  return res;
}

// Fetch all appointments
export async function fetchAppointments(): Promise<Appointment[]> {
  const res = await fetch('/api/appointments');
  checkStatus(res);
  return res.json();
}

// Create a new appointment
export async function addAppointment(
  input: { lead_id: string; scheduled_for: string; location?: string; notes?: string }
): Promise<Appointment> {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  checkStatus(res);
  return res.json();
}

// Fetch a single appointment
export async function fetchAppointment(id: string): Promise<Appointment> {
  const res = await fetch(`/api/appointments/${id}`);
  checkStatus(res);
  return res.json();
}

// Update an appointment
export async function updateAppointmentApi(
  id: string,
  updates: Partial<{ scheduled_for: string; location?: string; notes?: string }>
): Promise<Appointment> {
  const res = await fetch(`/api/appointments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  checkStatus(res);
  return res.json();
}

// Delete an appointment
export async function deleteAppointmentApi(id: string): Promise<void> {
  const res = await fetch(`/api/appointments/${id}`, {
    method: 'DELETE',
  });
  checkStatus(res);
} 