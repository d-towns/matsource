import { z } from 'zod';

// Enum for call_attempts.status
export const CallAttemptStatusEnum = z.enum([
  'queued',
  'initiated',
  'ringing',
  'in-progress',
  'completed',
  'busy',
  'failed',
  'no-answer',
  'canceled',

]);

// Enum for call_attempts.result
export const CallResultEnum = z.enum([
  'voicemail',
  'successful_ask',
  'appointment_set',
  'declined_ask',
  'requested_follow_up',
]);

// Base schema (no lead)
export const CallAttemptSchema = z.object({
  id: z.string().uuid(),
  lead_id: z.string().uuid(),
  twilio_call_sid: z.string().nullable().optional(),
  start_time: z.string(),
  end_time: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  recording_url: z.string().nullable().optional(),
  transcript: z
    .array(z.object({ role: z.string(), content: z.string().optional(), tool_call_id: z.string().nullable().optional()}))
    .nullable()
    .optional(),
  result: CallResultEnum.nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string().uuid().nullable().optional(),
  status: CallAttemptStatusEnum.nullable().optional(),
  team_id: z.string().uuid(),
  to_number: z.string().nullable().optional(),
});

export type CallAttempt = z.infer<typeof CallAttemptSchema>; 