import { CallAttempt } from '@/lib/models/callAttempt';

function checkStatus(res: Response) {
  if (!res.ok) throw new Error(res.statusText);
  return res;
}

// Fetch all call attempts
export async function fetchCalls(): Promise<CallAttempt[]> {
  const res = await fetch('/api/calls');
  checkStatus(res);
  return res.json();
}

// Create a new call attempt
export async function addCall(
  input: Omit<Partial<CallAttempt>, 'id' | 'created_at' | 'updated_at' | 'team_id'> & { lead_id: string }
): Promise<CallAttempt> {
  const res = await fetch('/api/calls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  checkStatus(res);
  return res.json();
}

// Fetch a single call attempt
export async function fetchCall(id: string): Promise<CallAttempt> {
  const res = await fetch(`/api/calls/${id}`);
  checkStatus(res);
  return res.json();
}

// Update a call attempt
export async function updateCallApi(
  id: string,
  updates: Partial<Omit<CallAttempt, 'id' | 'created_at' | 'updated_at' | 'team_id'>>
): Promise<CallAttempt> {
  const res = await fetch(`/api/calls/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  checkStatus(res);
  return res.json();
}

// Delete a call attempt
export async function deleteCallApi(id: string): Promise<void> {
  const res = await fetch(`/api/calls/${id}`, { method: 'DELETE' });
  checkStatus(res);
} 