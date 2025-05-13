import { Lead } from '@/lib/models/lead';

function checkStatus(res: Response) {
  if (!res.ok) throw new Error(res.statusText);
  return res;
}

// Fetch all leads
export async function fetchLeads(): Promise<Lead[]> {
  const res = await fetch('/api/leads');
  checkStatus(res);
  return res.json();
}

// Create a new lead
export async function addLead(
  input: { name?: string; phone: string; email?: string; source?: string; notes?: string }
): Promise<Lead> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  checkStatus(res);
  return res.json();
}

// Fetch a single lead
export async function fetchLead(id: string): Promise<Lead> {
  const res = await fetch(`/api/leads/${id}`);
  checkStatus(res);
  return res.json();
}

// Update a lead
export async function updateLead(
  id: string,
  updates: { name?: string; phone?: string; email?: string; source?: string; notes?: string; status?: string }
): Promise<Lead> {
  const res = await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  checkStatus(res);
  return res.json();
}

// Delete a lead
export async function deleteLead(id: string): Promise<void> {
  const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
  checkStatus(res);
} 