import { z } from 'zod';

export const PartnerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  contact_email: z.string().nullable().optional(),
  created_at: z.string().optional(),
  metadata: z.record(z.any()).nullable().optional(),
  stripe_account_id: z.string().nullable().optional(),
  white_label_origin: z.string().nullable().optional(),
  fee_percent: z.number().nullable().optional(),
});

export type Partner = z.infer<typeof PartnerSchema>; 