import { Agent } from '@/lib/models/agent';

function checkStatus(res: Response) {
  if (!res.ok) throw new Error(res.statusText);
  return res;
}

// Fetch all agents
export async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch('/api/agents');
  checkStatus(res);
  return res.json();
}

// Fetch a single agent
export async function fetchAgent(id: string): Promise<Agent> {
  const res = await fetch(`/api/agents/${id}`);
  checkStatus(res);
  return res.json();
}

// Create a new agent
export async function addAgent(
  input: Omit<Partial<Agent>, 'id' | 'created_at' | 'updated_at' | 'team_id'> & { name: string; type: 'inbound_voice' | 'outbound_voice' | 'browser' }
): Promise<Agent> {
  const res = await fetch('/api/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  checkStatus(res);
  return res.json();
}

// Update an agent
export async function updateAgentApi(
  id: string,
  updates: Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at' | 'team_id'>>
): Promise<Agent> {
  const res = await fetch(`/api/agents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  checkStatus(res);
  return res.json();
}

// Delete an agent
export async function deleteAgentApi(id: string): Promise<void> {
  const res = await fetch(`/api/agents/${id}`, {
    method: 'DELETE',
  });
  checkStatus(res);
} 