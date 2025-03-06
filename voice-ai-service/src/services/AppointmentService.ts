import { supabase } from '../config/supabase';
import { Database } from '../config/supabase';
import logger from '../config/logger';

// Type definitions
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type NewAppointment = Database['public']['Tables']['appointments']['Insert'];
export type UpdateAppointment = Database['public']['Tables']['appointments']['Update'];

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

/**
 * Service for managing appointment data
 */
export class AppointmentService {
  /**
   * Create a new appointment
   */
  static async create(appointment: NewAppointment): Promise<Appointment> {
    try {
      // Default values
      appointment.status = appointment.status || AppointmentStatus.SCHEDULED;
      appointment.duration = appointment.duration || 60; // Default duration: 60 minutes
      appointment.reminder_sent = appointment.reminder_sent || false;
      appointment.created_at = new Date().toISOString();
      appointment.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      logger.info('Appointment created', { appointmentId: data.id });
      
      return data;
    } catch (error) {
      logger.error('Error creating appointment', { error });
      throw error;
    }
  }
  
  /**
   * Get appointment by ID
   */
  static async getById(id: string): Promise<Appointment | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        // If not found, return null instead of throwing error
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      logger.error('Error getting appointment by ID', { error, id });
      throw error;
    }
  }
  
  /**
   * Update an appointment
   */
  static async update(id: string, update: UpdateAppointment): Promise<Appointment> {
    try {
      // Set updated_at
      update.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('appointments')
        .update(update)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      logger.info('Appointment updated', { appointmentId: id });
      
      return data;
    } catch (error) {
      logger.error('Error updating appointment', { error, id });
      throw error;
    }
  }
  
  /**
   * Get appointments by lead ID
   */
  static async getByLeadId(leadId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('lead_id', leadId)
        .order('scheduled_time', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      logger.error('Error getting appointments by lead ID', { error, leadId });
      throw error;
    }
  }
  
  /**
   * Get appointments by status
   */
  static async getByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', status)
        .order('scheduled_time', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      logger.error('Error getting appointments by status', { error, status });
      throw error;
    }
  }
  
  /**
   * Get upcoming appointments (scheduled within next 7 days)
   */
  static async getUpcoming(): Promise<Appointment[]> {
    try {
      // Calculate date range for upcoming appointments
      const now = new Date();
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(now.getDate() + 7);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('scheduled_time', now.toISOString())
        .lte('scheduled_time', sevenDaysLater.toISOString())
        .in('status', [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
        .order('scheduled_time', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      logger.error('Error getting upcoming appointments', { error });
      throw error;
    }
  }
  
  /**
   * Get appointments needing reminders (scheduled within 24 hours, reminder not sent)
   */
  static async getNeedingReminders(): Promise<Appointment[]> {
    try {
      // Calculate date range for appointments needing reminders
      const now = new Date();
      const oneDayLater = new Date();
      oneDayLater.setHours(now.getHours() + 24);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('scheduled_time', now.toISOString())
        .lte('scheduled_time', oneDayLater.toISOString())
        .in('status', [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
        .eq('reminder_sent', false)
        .order('scheduled_time', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      logger.error('Error getting appointments needing reminders', { error });
      throw error;
    }
  }
  
  /**
   * List appointments with pagination
   */
  static async list(page = 1, limit = 20): Promise<{ appointments: Appointment[]; count: number }> {
    try {
      // Calculate pagination values
      const offset = (page - 1) * limit;
      
      // Get appointments
      const { data, error, count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('scheduled_time', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return {
        appointments: data || [],
        count: count || 0,
      };
    } catch (error) {
      logger.error('Error listing appointments', { error });
      throw error;
    }
  }
  
  /**
   * Cancel an appointment
   */
  static async cancel(id: string, reason?: string): Promise<Appointment> {
    try {
      const update: UpdateAppointment = {
        status: AppointmentStatus.CANCELLED,
        updated_at: new Date().toISOString(),
      };
      
      if (reason) {
        update.notes = reason;
      }
      
      const { data, error } = await supabase
        .from('appointments')
        .update(update)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      logger.info('Appointment cancelled', { appointmentId: id, reason });
      
      return data;
    } catch (error) {
      logger.error('Error cancelling appointment', { error, id });
      throw error;
    }
  }
  
  /**
   * Mark reminder as sent
   */
  static async markReminderSent(id: string): Promise<Appointment> {
    try {
      const update: UpdateAppointment = {
        reminder_sent: true,
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('appointments')
        .update(update)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      logger.info('Appointment reminder marked as sent', { appointmentId: id });
      
      return data;
    } catch (error) {
      logger.error('Error marking reminder as sent', { error, id });
      throw error;
    }
  }
  
  /**
   * Check for scheduling conflicts
   */
  static async checkForConflicts(scheduledTime: string, duration: number): Promise<boolean> {
    try {
      // Calculate end time based on duration
      const startTime = new Date(scheduledTime);
      const endTime = new Date(startTime.getTime() + (duration * 60 * 1000));
      
      // Find appointments that overlap with this time slot
      const { data, error } = await supabase
        .from('appointments')
        .select('id')
        .or(`scheduled_time.gte.${startTime.toISOString()},scheduled_time.lte.${endTime.toISOString()}`)
        .in('status', [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED]);
      
      if (error) {
        throw error;
      }
      
      // Return true if conflicts exist
      return (data && data.length > 0);
    } catch (error) {
      logger.error('Error checking for appointment conflicts', { error, scheduledTime, duration });
      throw error;
    }
  }
}

export default AppointmentService; 