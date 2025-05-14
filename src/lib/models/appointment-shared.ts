import { z } from 'zod';
import { AppointmentSchema } from './appointment';
import { LeadSchema } from './lead';
import { CallAttemptSchema } from './callAttempt';

// Appointment with nested lead
export const AppointmentWithLeadSchema = AppointmentSchema.extend({
  lead: LeadSchema.optional().nullable(),
});
export type AppointmentWithLead = z.infer<typeof AppointmentWithLeadSchema>;

// Appointment with nested call attempt
export const AppointmentWithCallAttemptSchema = AppointmentSchema.extend({
  call_attempt: CallAttemptSchema.optional().nullable(),
});
export type AppointmentWithCallAttempt = z.infer<typeof AppointmentWithCallAttemptSchema>;

// Appointment with both lead and call attempt
export const AppointmentWithLeadAndCallAttemptSchema = AppointmentSchema.extend({
  lead: LeadSchema.optional().nullable(),
  call_attempt: CallAttemptSchema.optional().nullable(),
});
export type AppointmentWithLeadAndCallAttempt = z.infer<typeof AppointmentWithLeadAndCallAttemptSchema>; 