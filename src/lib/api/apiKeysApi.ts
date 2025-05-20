export async function fetchApiKeys(teamId: string) {
  const res = await fetch(`/api/api-keys?teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) throw new Error('Failed to fetch API keys');
  const { keys } = await res.json();
  return keys;
}

export async function addApiKey(name: string, teamId: string) {
  const res = await fetch('/api/api-keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, teamId }),
  });
  if (!res.ok) throw new Error('Failed to create API key');
  return await res.json();
}

export async function deleteApiKey(id: string, teamId: string) {
  const res = await fetch(`/api/api-keys/[id]?id=${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId }),
  });
  if (!res.ok) throw new Error('Failed to delete API key');
} 