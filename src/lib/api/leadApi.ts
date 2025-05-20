import { Lead } from '@/lib/models/lead';
import { LeadWithCallAttempts, LeadWithCallCount } from '../models/lead-callAttempt-shared';

function checkStatus(res: Response) {
  if (!res.ok) throw new Error(res.statusText);
  return res;
}

// Fetch all leads
export async function fetchLeads(teamId: string): Promise<Lead[]> {
  const res = await fetch(`/api/leads?teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Create a new lead
export async function addLead(
  input: { name?: string; phone: string; email?: string; source?: string; notes?: string },
  teamId: string
): Promise<Lead> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, teamId }),
  });
  checkStatus(res);
  return res.json();
}

// Fetch a single lead
export async function fetchLead(id: string, teamId: string): Promise<Lead> {
  const res = await fetch(`/api/leads/${id}?teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Update a lead
export async function updateLead(
  id: string,
  updates: { name?: string; phone?: string; email?: string; source?: string; notes?: string; status?: string },
  teamId: string
): Promise<Lead> {
  const res = await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...updates, teamId }),
  });
  checkStatus(res);
  return res.json();
}

// Delete a lead
export async function deleteLead(id: string, teamId: string): Promise<void> {
  const res = await fetch(`/api/leads/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId }),
  });
  checkStatus(res);
}

// Fetch a lead with its call attempts
export async function fetchLeadWithCallAttempts(id: string, teamId: string): Promise<LeadWithCallAttempts> {
  const res = await fetch(`/api/leads/${id}?withCalls=true&teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

// Fetch all leads with call count (for summary table)
export async function fetchLeadsWithCallCount(teamId: string): Promise<LeadWithCallCount[]> {
  const res = await fetch(`/api/leads?withCallCount=true&teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
} 