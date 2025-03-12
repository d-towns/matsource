import { z } from "zod"

// Define schemas for type safety
export const LeadSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email().optional().nullable(),
  source: z.string().optional().nullable(),
  status: z.enum([
    'appointment_set', 
    'declined', 
    'no_answer', 
    'follow_up',
    'new',
  ]).optional().default("new"),
  notes: z.string().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  user_id: z.string().uuid(),
})

export const CallAttemptSchema = z.object({
  id: z.string().uuid(),
  lead_id: z.string().uuid(),
  user_id: z.string().uuid(),
  call_sid: z.string().optional().nullable(),
  outcome: z.enum([
    "connected", 
    "voicemail", 
    "no_answer", 
    "busy", 
    "failed", 
    "appointment_scheduled", 
    "declined", 
    "follow_up"
  ]).optional(),
  duration: z.number().optional(),
  notes: z.string().optional().nullable(),
  transcription: z.string().optional().nullable(),
  scheduled_time: z.string().datetime().optional().nullable(),
  started_at: z.string().datetime().optional().nullable(),
  ended_at: z.string().datetime().optional().nullable(),
  appointment_id: z.string().uuid().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
})

// Derive TypeScript types from Zod schemas
export type Lead = z.infer<typeof LeadSchema>
export type CallAttempt = z.infer<typeof CallAttemptSchema>

// Create summary type for leads with call attempts count
export type LeadWithCallCount = Lead & {
  call_count: number
  last_call_date?: string
  last_call_outcome?: string
}

// Create call attempt with lead info type
export type CallAttemptWithLead = CallAttempt & {
  lead: {
    name: string
    phone: string
    email?: string | null
  }
} 