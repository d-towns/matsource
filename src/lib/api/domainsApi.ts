import { Domain } from '@/lib/services/DomainService';

export async function fetchDomains(teamId: string): Promise<Domain[]> {
  const res = await fetch(`/api/domains?teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) throw new Error('Failed to fetch domains');
  const { domains } = await res.json();
  return domains;
}

export async function addDomain(domain: string, teamId: string): Promise<Domain> {
  const res = await fetch('/api/domains', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, teamId }),
  });
  if (!res.ok) throw new Error('Failed to create domain');
  return await res.json();
}

export async function deleteDomain(id: string, teamId: string): Promise<void> {
  const res = await fetch('/api/domains', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, teamId }),
  });
  if (!res.ok) throw new Error('Failed to delete domain');
} 