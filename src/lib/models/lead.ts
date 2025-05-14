import { z } from 'zod';

// Enum for lead_status
export const LeadStatusEnum = z.enum([
  'appointment_set',
  'declined',
  'no_answer',
  'follow_up',
  'new',
  'in_progress',
]);

// Base schema (no call_attempts)
export const LeadSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable().optional(),
  phone: z.string(),
  email: z.string().nullable().optional(),
  source: z.string(),
  notes: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string().uuid().nullable().optional(),
  status: LeadStatusEnum.nullable().optional(),
  team_id: z.string().uuid().nullable().optional(),
});

export type Lead = z.infer<typeof LeadSchema>; 