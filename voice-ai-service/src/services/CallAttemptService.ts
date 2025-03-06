import { supabase, Database } from '../config/supabase';
import logger from '../config/logger';

// Types
export type CallAttempt = Database['public']['Tables']['call_attempts']['Row'];
export type NewCallAttempt = Database['public']['Tables']['call_attempts']['Insert'];
export type UpdateCallAttempt = Database['public']['Tables']['call_attempts']['Update'];

export enum CallStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  NO_ANSWER = 'no_answer',
}

export enum CallResult {
  APPOINTMENT_SET = 'appointment_set',
  CALL_BACK_LATER = 'call_back_later',
  NOT_INTERESTED = 'not_interested',
  WRONG_NUMBER = 'wrong_number',
  UNDETERMINED = 'undetermined',
}

/**
 * Service for interacting with call attempts in the database
 */
export class CallAttemptService {
  /**
   * Create a new call attempt
   */
  static async create(callAttempt: NewCallAttempt): Promise<CallAttempt> {
    try {
      const { data, error } = await supabase
        .from('call_attempts')
        .insert(callAttempt)
        .select()
        .single();

      if (error) {
        logger.error('Error creating call attempt', { error, callAttempt });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error in CallAttemptService.create', { error });
      throw error;
    }
  }

  /**
   * Get a call attempt by ID
   */
  static async getById(id: string): Promise<CallAttempt | null> {
    try {
      const { data, error } = await supabase
        .from('call_attempts')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        // If no rows returned, return null instead of throwing error
        if (error.code === 'PGRST116') {
          return null;
        }
        
        logger.error('Error fetching call attempt by ID', { error, id });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error in CallAttemptService.getById', { error });
      throw error;
    }
  }

  /**
   * Get a call attempt by Twilio Call SID
   */
  static async getByTwilioCallSid(twilioCallSid: string): Promise<CallAttempt | null> {
    try {
      const { data, error } = await supabase
        .from('call_attempts')
        .select()
        .eq('twilio_call_sid', twilioCallSid)
        .single();

      if (error) {
        // If no rows returned, return null instead of throwing error
        if (error.code === 'PGRST116') {
          return null;
        }
        
        logger.error('Error fetching call attempt by Twilio Call SID', { error, twilioCallSid });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error in CallAttemptService.getByTwilioCallSid', { error });
      throw error;
    }
  }

  /**
   * Update a call attempt
   */
  static async update(id: string, update: UpdateCallAttempt): Promise<CallAttempt> {
    try {
      const { data, error } = await supabase
        .from('call_attempts')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating call attempt', { error, id, update });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error in CallAttemptService.update', { error });
      throw error;
    }
  }

  /**
   * Get call attempts by lead ID
   */
  static async getByLeadId(leadId: string): Promise<CallAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('call_attempts')
        .select()
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching call attempts by lead ID', { error, leadId });
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Error in CallAttemptService.getByLeadId', { error });
      throw error;
    }
  }

  /**
   * Get call attempts by status
   */
  static async getByStatus(status: CallStatus): Promise<CallAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('call_attempts')
        .select()
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching call attempts by status', { error, status });
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Error in CallAttemptService.getByStatus', { error });
      throw error;
    }
  }

  /**
   * Get recent call attempts with pagination
   */
  static async list(page = 1, limit = 20): Promise<{ callAttempts: CallAttempt[]; count: number }> {
    try {
      // Calculate offset
      const offset = (page - 1) * limit;

      // Get count of all call attempts
      const { count, error: countError } = await supabase
        .from('call_attempts')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        logger.error('Error counting call attempts', { error: countError });
        throw countError;
      }

      // Get call attempts with pagination
      const { data, error } = await supabase
        .from('call_attempts')
        .select()
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        logger.error('Error listing call attempts', { error, page, limit });
        throw error;
      }

      return {
        callAttempts: data || [],
        count: count || 0,
      };
    } catch (error) {
      logger.error('Error in CallAttemptService.list', { error });
      throw error;
    }
  }
}

export default CallAttemptService; 