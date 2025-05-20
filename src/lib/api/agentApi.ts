import { Agent } from '@/lib/models/agent';


// Fetch all agents
export async function fetchAgents(teamId: string): Promise<Agent[]> {
  const res = await fetch(`/api/agents?teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) throw new Error('Failed to fetch agents');
  const { agents } = await res.json();
  return agents;
}

// Fetch a single agent
export async function fetchAgent(id: string, teamId: string): Promise<Agent> {
  const res = await fetch(`/api/agents/${id}?teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) throw new Error('Failed to fetch agent');
  return await res.json();
}

// Create a new agent
export async function addAgent(
  input: Omit<Partial<Agent>, 'id' | 'created_at' | 'updated_at' | 'team_id'> & { name: string; type: 'inbound_voice' | 'outbound_voice' | 'browser' },
  teamId: string
): Promise<Agent> {
  const res = await fetch('/api/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, teamId }),
  });
  if (!res.ok) throw new Error('Failed to create agent');
  return await res.json();
}

// Update an agent
export async function updateAgentApi(
  id: string,
  updates: Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at' | 'team_id'>>,
  teamId: string
): Promise<Agent> {
  const res = await fetch('/api/agents', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates, teamId }),
  });
  if (!res.ok) throw new Error('Failed to update agent');
  return await res.json();
}

// Delete an agent
export async function deleteAgentApi(id: string, teamId: string): Promise<void> {
  const res = await fetch('/api/agents', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, teamId }),
  });
  if (!res.ok) throw new Error('Failed to delete agent');
} 