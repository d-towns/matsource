import { z } from 'zod';

export const PartnerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  contact_email: z.string().nullable().optional(),
  created_at: z.string().optional(),
  metadata: z.record(z.any()).nullable().optional(),
});

export type Partner = z.infer<typeof PartnerSchema>; 