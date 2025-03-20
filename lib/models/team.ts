import {z} from "zod"

export const Team = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    created_at: z.string(),
    logo: z.any().optional(),
    plan: z.string().optional(),
})

export type Team = z.infer<typeof Team>

export const TeamCreate = Team.omit({id: true, created_at: true})
export type TeamCreate = z.infer<typeof TeamCreate>

export const TeamUpdate = TeamCreate.partial()
export type TeamUpdate = z.infer<typeof TeamUpdate>

