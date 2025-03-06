import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Environment {
  port: number;
  nodeEnv: string;
  supabaseUrl: string;
  supabaseApiKey: string;
  openaiApiKey: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  jwtSecret: string;
  logLevel: string;
}

// Export environment variables with defaults
export const env: Environment = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseApiKey: process.env.SUPABASE_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key-for-development',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required environment variables
export const validateEnv = (): void => {
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_API_KEY',
    'OPENAI_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'JWT_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}; 