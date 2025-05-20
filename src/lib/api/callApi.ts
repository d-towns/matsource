import { CallAttempt } from '@/lib/models/callAttempt';
import { CallAttemptWithLead } from '@/lib/models/lead-callAttempt-shared';

function checkStatus(res: Response) {
  if (!res.ok) throw new Error(res.statusText);
  return res;
}

// Fetch all call attempts
export async function fetchCalls(teamId: string): Promise<CallAttempt[]> {
  const res = await fetch(`/api/calls?teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Create a new call attempt
export async function addCall(
  input: Omit<Partial<CallAttempt>, 'id' | 'created_at' | 'updated_at' | 'team_id'> & { lead_id: string },
  teamId: string
): Promise<CallAttempt> {
  const res = await fetch('/api/calls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, teamId }),
  });
  checkStatus(res);
  return res.json();
}

// Fetch a single call attempt
export async function fetchCall(id: string, teamId: string): Promise<CallAttempt> {
  const res = await fetch(`/api/calls/${id}?teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Update a call attempt
export async function updateCallApi(
  id: string,
  updates: Partial<Omit<CallAttempt, 'id' | 'created_at' | 'updated_at' | 'team_id'>>,
  teamId: string
): Promise<CallAttempt> {
  const res = await fetch(`/api/calls/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...updates, teamId }),
  });
  checkStatus(res);
  return res.json();
}

// Delete a call attempt
export async function deleteCallApi(id: string, teamId: string): Promise<void> {
  const res = await fetch(`/api/calls/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId }),
  });
  checkStatus(res);
}

// Fetch all call attempts with joined lead info
export async function fetchCallsWithLead(teamId: string): Promise<CallAttemptWithLead[]> {
  const res = await fetch(`/api/calls?withLead=true&teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

// Fetch a single call attempt with joined lead info
export async function fetchCallWithLead(id: string, teamId: string): Promise<CallAttemptWithLead> {
  const res = await fetch(`/api/calls/${id}?withLead=true&teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
} 

