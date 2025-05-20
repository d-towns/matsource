import { Partner } from "../models/partner";
import { Team } from "../models/team";
// Fetch the current user's partner
export async function fetchPartner(): Promise<Partner> {
  const res = await fetch('/api/partners');
  if (!res.ok) throw new Error('Failed to fetch partner');
  const { partner } = await res.json();
  return partner;
}

// Fetch all teams for the current user's partner
export async function fetchTeamsForPartner(): Promise<Team[]> {
  const res = await fetch('/api/partners/teams');
  if (!res.ok) throw new Error('Failed to fetch partner teams');
  const { teams } = await res.json();
  return teams;
}

// Create a team for the current user's partner
export async function addTeamForPartner(team: { name: string; description?: string }): Promise<Team> {
  console.log('addTeamForPartner', team);
  const res = await fetch('/api/partners/teams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team),
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Failed to create team');
  }
  const { team: createdTeam } = await res.json();
  return createdTeam;
} 