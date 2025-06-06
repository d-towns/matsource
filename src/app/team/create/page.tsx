import { redirect } from "next/navigation";
import { UserService } from "@/lib/services/UserService";
import { createTeamForPartner } from "@/lib/services/PartnerService";
import { TeamCreate, Team } from "@/lib/models/team";

export default async function CreateTeamPage() {
  const user = await UserService.getUser();

  if (!user || !user.id) {
    redirect("/signin");
  }

  if (!user.partner_id) {
    redirect("/workspaces/dashboard");
  }

  let newTeam: Team;
  try {
    const userName = user.name || user.email?.split('@')[0] || "User";
    const teamName = `${userName}'s Team`;
    
    const teamData: TeamCreate = {
      name: teamName,
      description: "Default team created automatically",
    };

    newTeam = await createTeamForPartner(user.partner_id, teamData, user.id);

  } catch (error) {
    console.error("Failed to create default team during API call:", error);
    if (typeof error === 'object' && error !== null && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
        throw error;
    }
    redirect("/workspaces/dashboard?error=team_creation_failed");
  }

  redirect(`/onboarding/plan-choice?teamId=${newTeam.id}`);
} 