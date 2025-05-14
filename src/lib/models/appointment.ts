import { z } from 'zod';

export const AppointmentStatusEnum = z.enum([
  'scheduled',
  'confirmed',
  'completed',
  'cancelled',
  'no_show',
]);

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  lead_id: z.string().uuid(),
  call_attempt_id: z.string().uuid(),
  scheduled_time: z.string(), // ISO string
  duration: z.number().default(60),
  status: AppointmentStatusEnum.default('scheduled'),
  notes: z.string().nullable().optional(),
  reminder_sent: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string().uuid().nullable().optional(),
  event_id: z.string().nullable().optional(),
  meeting_type: z.string().nullable().optional(),
  team_id: z.string().uuid().nullable().optional(),
  address: z.string().nullable().optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>; 