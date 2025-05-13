import { Lead } from "./leads"

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export interface Appointment {
  id: string
  lead_id: string
  lead: Lead
  call_attempt_id: string
  scheduled_time: string
  duration: number
  user_id: string
  status: AppointmentStatus
  notes: string | null
  reminder_sent: boolean
  created_at: string
  updated_at: string
} 