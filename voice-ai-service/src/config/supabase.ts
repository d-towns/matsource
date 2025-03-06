import { createClient } from '@supabase/supabase-js';
import { env } from './environment';
import logger from './logger';

// Define the database types for the schema
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          user_id: string;
          source: string;
          status: 'pending' | 'in_progress' | 'appointment_set' | 'failed' | 'no_answer';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email: string;
          source?: string;
          user_id?: string;
          status?: 'pending' | 'in_progress' | 'appointment_set' | 'failed' | 'no_answer';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string;
          source?: string;
          user_id?: string;
          status?: 'pending' | 'in_progress' | 'appointment_set' | 'failed' | 'no_answer';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      call_attempts: {
        Row: {
          id: string;
          lead_id: string;
          twilio_call_sid: string | null;
          start_time: string;
          end_time: string | null;
          duration: number | null;
          user_id: string;
          recording_url: string | null;
          transcript: string | null;
          status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'no_answer';
          result: 'appointment_set' | 'call_back_later' | 'not_interested' | 'wrong_number' | 'undetermined';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          twilio_call_sid?: string | null;
          start_time?: string;
          end_time?: string | null;
          duration?: number | null;
          user_id?: string;
          recording_url?: string | null;
          transcript?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'no_answer';
          result?: 'appointment_set' | 'call_back_later' | 'not_interested' | 'wrong_number' | 'undetermined';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          twilio_call_sid?: string | null;
          start_time?: string;
          end_time?: string | null;
          duration?: number | null;
          user_id?: string;
          recording_url?: string | null;
          transcript?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'no_answer';
          result?: 'appointment_set' | 'call_back_later' | 'not_interested' | 'wrong_number' | 'undetermined';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          lead_id: string;
          call_attempt_id: string;
          scheduled_time: string;
          duration: number;
          user_id: string;
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
          notes: string | null;
          reminder_sent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          call_attempt_id: string;  
          scheduled_time: string;
          duration?: number;
          user_id: string;
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
          notes?: string | null;
          reminder_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          call_attempt_id?: string;
          scheduled_time?: string;
          duration?: number;
          user_id?: string;
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
          notes?: string | null;
          reminder_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Create a Supabase client
export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseApiKey
);

// Initialize Supabase connection
export const initSupabase = async (): Promise<void> => {
  try {
    // Check if the connection is working by making a small query
    const { data, error } = await supabase
      .from('leads')
      .select('count')
      .limit(1);

    if (error) {
      throw error;
    }

    logger.info('Supabase connection established successfully');
  } catch (error) {
    logger.error('Failed to connect to Supabase', { error });
    throw new Error('Failed to connect to Supabase');
  }
};

export default supabase; 