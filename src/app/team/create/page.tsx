import { redirect } from "next/navigation";
import { UserService } from "@/lib/services/UserService";
import { TeamCreateForm } from "@/components/team-create/TeamCreateForm";

export default async function CreateTeamPage() {
  const user = await UserService.getUser();

  if (!user.partner_id) {
    redirect("/workspaces/dashboard");
  }

  return (
    <div className="max-w-lg mx-auto py-12 font-sans">
      <h1 className="text-2xl font-bold mb-6 font-sans">Create a New Team</h1>
      <TeamCreateForm />
    </div>
  );
} 