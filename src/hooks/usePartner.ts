import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api/partnerApi';
import { Partner } from '@/lib/models/partner';
import { Team } from '@/lib/models/team';

// Hook to fetch the current user's partner
export function usePartner() {
  return useQuery<Partner | null>({
    queryKey: ['partner'],
    queryFn: api.fetchPartner,
  });
}

// Hook to fetch all teams for the current user's partner
export function usePartnerTeams() {
  return useQuery<Team[]>({
    queryKey: ['partnerTeams'],
    queryFn: api.fetchTeamsForPartner,
  });
}

// Hook to add a team for the current user's partner
export function useAddTeamForPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (team: { name: string; description?: string }) => api.addTeamForPartner(team),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['partnerTeams'] }),
  });
} 