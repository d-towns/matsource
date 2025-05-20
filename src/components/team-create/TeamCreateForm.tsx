"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddTeamForPartner } from "@/hooks/usePartner";
import { useTeam } from "@/context/team-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TeamCreateSchema = z.object({
  name: z.string().min(2, "Team name is required"),
  description: z.string().optional(),
});

type TeamCreateFormValues = z.infer<typeof TeamCreateSchema>;

export function TeamCreateForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeamCreateFormValues>({
    resolver: zodResolver(TeamCreateSchema),
  });
  const [formError, setFormError] = useState<string | null>(null);
  const addTeam = useAddTeamForPartner();
  const { setActiveTeam } = useTeam();

  const onSubmit = async (values: TeamCreateFormValues) => {
    setFormError(null);
    try {
      const result = await addTeam.mutateAsync({
        name: values.name,
        description: values.description,
      });
      setActiveTeam(result);
      router.push(`/workspaces/dashboard?teamId=${result.id}`);
    } catch (err) {
      setFormError(err.message || "Failed to create team");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8 space-y-6 font-sans">
      <div>
        <label className="block font-semibold mb-1 font-sans" htmlFor="name">
          Team Name
        </label>
        <Input id="name" {...register("name")} className="font-sans" />
        {errors.name && <p className="text-red-500 text-sm font-sans mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block font-semibold mb-1 font-sans" htmlFor="description">
          Description
        </label>
        <Textarea id="description" {...register("description")} className="font-sans" />
        {errors.description && <p className="text-red-500 text-sm font-sans mt-1">{errors.description.message}</p>}
      </div>
      {formError && <div className="text-red-600 font-sans font-medium">{formError}</div>}
      <Button type="submit" className="w-full font-sans" disabled={isSubmitting || addTeam.isPending}>
        {addTeam.isPending ? "Creating..." : "Create Team"}
      </Button>
    </form>
  );
} 