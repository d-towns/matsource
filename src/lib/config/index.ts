/**
 * Global Configuration
 * 
 * This file centralizes all environment variables and provides direct access
 * to environment variables through process.env
 */

// Helper function to determine if we're in development
const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === 'development';
const isStaging = process.env.NEXT_PUBLIC_NODE_ENV === 'staging';
const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === 'production';


export const config = {
  // Environment
  env: {
    isDevelopment,
    isProduction,
    nodeEnv: process.env.NODE_ENV || 'development',
    nextPublicNodeEnv: process.env.NEXT_PUBLIC_NODE_ENV || 'development',
    isCi: !!process.env.CI,
    isWhiteLabel: process.env.NEXT_PUBLIC_WHITE_LABEL === 'true',
  },

  // Application URLs
  app: {
    baseUrl: isDevelopment 
      ? (process.env.NEXT_PUBLIC_DEV_BASE_URL || 'http://localhost:3000')
      : process.env.NEXT_PUBLIC_BASE_URL!,
    devBaseUrl: process.env.NEXT_PUBLIC_DEV_BASE_URL || 'http://localhost:3000',
    prodBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  },

  // Database (Supabase)
  database: {
    url: isDevelopment
      ? process.env.NEXT_PUBLIC_DEV_SUPABASE_URL!
      : process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: isDevelopment
      ? process.env.NEXT_PUBLIC_DEV_SUPABASE_ANON_KEY!
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: isDevelopment
      ? process.env.NEXT_PUBLIC_DEV_SUPABASE_SERVICE_ROLE_KEY!
      : process.env.SUPABASE_SERVICE_ROLE_KEY!,
    // Individual environment URLs for specific use cases
    devUrl: process.env.NEXT_PUBLIC_DEV_SUPABASE_URL,
    prodUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    devAnonKey: process.env.NEXT_PUBLIC_DEV_SUPABASE_ANON_KEY,
    prodAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    devServiceRoleKey: process.env.NEXT_PUBLIC_DEV_SUPABASE_SERVICE_ROLE_KEY,
    prodServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Payment Processing (Stripe)
  payments: {
    stripe: {
      secretKey: isDevelopment || isStaging
        ? process.env.STRIPE_DEV_SECRET_KEY!
        : process.env.STRIPE_SECRET_KEY!,
      webhookSecret: isDevelopment
        ? process.env.STRIPE_WEBHOOK_SECRET_DEV!
        : process.env.STRIPE_WEBHOOK_SECRET!,
      // Individual keys for specific use cases
      devSecretKey: process.env.STRIPE_DEV_SECRET_KEY,
      prodSecretKey: process.env.STRIPE_SECRET_KEY,
      devWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET_DEV,
      prodWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },

  // External Services
  services: {
    // Google Services
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      projectId: process.env.GOOGLE_PROJECT_ID,
      privateKey: process.env.GOOGLE_PRIVATE_KEY,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      callbackUrl: `${isDevelopment 
        ? (process.env.NEXT_PUBLIC_DEV_BASE_URL || 'http://localhost:3000')
        : process.env.NEXT_PUBLIC_BASE_URL!}/api/integrations/google/callback`,
    },

    // Jobber Services
    jobber: {
      clientId: process.env.JOBBER_CLIENT_ID!,
      clientSecret: process.env.JOBBER_CLIENT_SECRET!,
      baseUrl: process.env.JOBBER_BASE_URL || 'https://api.getjobber.com',
      authUrl: process.env.JOBBER_AUTH_URL || 'https://api.getjobber.com/api/oauth/authorize',
      tokenUrl: process.env.JOBBER_TOKEN_URL || 'https://api.getjobber.com/api/oauth/token',
      callbackUrl: `${isDevelopment 
        ? (process.env.NEXT_PUBLIC_DEV_BASE_URL || 'http://localhost:3000')
        : process.env.NEXT_PUBLIC_BASE_URL!}/api/integrations/jobber/callback`,
      scopes: process.env.JOBBER_SCOPES || 'read_clients,read_jobs,read_invoices',
    },

    // Twilio
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID!,
      authToken: process.env.TWILIO_AUTH_TOKEN!,
    },

    // Redis
    redis: {
      url: process.env.REDIS_URL!,
    },

    // Voice Services
    voice: {
      serviceUrl: process.env.VOICE_AGENT_SERVICE_URL,
      apiKey: process.env.VOICE_SERVICE_API_KEY,
    },
  },

  // Widget Configuration
  widget: {
    jwtSecret: process.env.WIDGET_JWT_SECRET!,
  },
} as const;

// Type definitions for better TypeScript support
export type Config = typeof config;

// Export individual sections for convenience
export const { env, app, database, payments, services, widget } = config;

// Default export
export default config;