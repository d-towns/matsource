import { z } from 'zod';
import { LeadSchema } from './lead';
import { CallAttemptSchema } from './callAttempt';

// CallAttempt with nested lead
export const CallAttemptWithLeadSchema = CallAttemptSchema.extend({
  leads: LeadSchema.nullable().optional(), // for Supabase join: .select('*, leads(*)')
});
export type CallAttemptWithLead = z.infer<typeof CallAttemptWithLeadSchema>;

// Lead with nested call attempts
export const LeadWithCallAttemptsSchema = LeadSchema.extend({
  call_attempts: z.array(CallAttemptSchema).optional(),
});
export type LeadWithCallAttempts = z.infer<typeof LeadWithCallAttemptsSchema>;

// Lead with call count (for summary tables)
export const LeadWithCallCountSchema = LeadSchema.extend({
  call_count: z.number(),
  last_call_date: z.string().nullable().optional(),
});
export type LeadWithCallCount = z.infer<typeof LeadWithCallCountSchema>; 