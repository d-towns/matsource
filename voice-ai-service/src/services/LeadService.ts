import { supabase, Database } from '../config/supabase';
import logger from '../config/logger';

// Types
export type Lead = Database['public']['Tables']['leads']['Row'];
export type NewLead = Database['public']['Tables']['leads']['Insert'];
export type UpdateLead = Database['public']['Tables']['leads']['Update'];

export enum LeadStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPOINTMENT_SET = 'appointment_set',
  FAILED = 'failed',
  NO_ANSWER = 'no_answer',
}

/**
 * Service for interacting with leads in the database
 */
export class LeadService {
  /**
   * Create a new lead
   */
  static async create(lead: NewLead): Promise<Lead> {
    try {
      logger.info('DICK', { lead });

      const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select()
        .single();

      if (error) {
        logger.error('Error creating lead', { error, lead });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error in LeadService.create', { error });
      throw error;
    }
  }

  /**
   * Get a lead by ID
   */
  static async getById(id: string): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        // If no rows returned, return null instead of throwing error
        if (error.code === 'PGRST116') {
          return null;
        }
        
        logger.error('Error fetching lead by ID', { error, id });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error in LeadService.getById', { error });
      throw error;
    }
  }

  /**
   * Get a lead by phone number
   */
  static async getByPhone(phone: string): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select()
        .eq('phone', phone)
        .single();

      if (error) {
        // If no rows returned, return null instead of throwing error
        if (error.code === 'PGRST116') {
          return null;
        }
        
        logger.error('Error fetching lead by phone', { error, phone });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error in LeadService.getByPhone', { error });
      throw error;
    }
  }

  /**
   * Update a lead
   */
  static async update(id: string, update: UpdateLead): Promise<Lead> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating lead', { error, id, update });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error in LeadService.update', { error });
      throw error;
    }
  }

  /**
   * Get leads by status
   */
  static async getByStatus(status: LeadStatus): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select()
        .eq('status', status);

      if (error) {
        logger.error('Error fetching leads by status', { error, status });
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Error in LeadService.getByStatus', { error });
      throw error;
    }
  }

  /**
   * List all leads with pagination
   */
  static async list(page = 1, limit = 20): Promise<{ leads: Lead[]; count: number }> {
    try {
      // Calculate offset
      const offset = (page - 1) * limit;

      // Get count of all leads
      const { count, error: countError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        logger.error('Error counting leads', { error: countError });
        throw countError;
      }

      // Get leads with pagination
      const { data, error } = await supabase
        .from('leads')
        .select()
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        logger.error('Error listing leads', { error, page, limit });
        throw error;
      }

      return {
        leads: data || [],
        count: count || 0,
      };
    } catch (error) {
      logger.error('Error in LeadService.list', { error });
      throw error;
    }
  }
}

export default LeadService; 