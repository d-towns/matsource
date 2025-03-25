import { z } from "zod";

export const BlogSchema = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    author: z.string(),
    subtitle: z.string(),
    slug: z.string(),
    images: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
})

export type Blog = z.infer<typeof BlogSchema>
