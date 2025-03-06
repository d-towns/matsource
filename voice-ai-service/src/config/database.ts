import { initSupabase } from './supabase';
import logger from './logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    // Initialize Supabase connection
    await initSupabase();
    
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Failed to connect to database', { error });
    // Exit process with failure
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  // Supabase doesn't require explicit disconnect
  logger.info('Database connection closed successfully');
}; 