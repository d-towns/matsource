import { z } from 'zod';

/**
 * Schema for the Jobber tokens table
 * Stores OAuth2 tokens for accessing Jobber API
 */
export const jobberTokenSchema = z.object({
  // Primary key, auto-generated UUID
  id: z.string().uuid(),
  
  // Foreign key to users table (who authorized the integration)
  user_id: z.string().uuid().nullable(),
  
  // Foreign key to teams table (which team owns the integration)
  team_id: z.string().uuid(),
  
  // OAuth2 tokens
  access_token: z.string(),
  refresh_token: z.string(),
  
  // Token expiration timestamp
  expires_at: z.string().datetime(),
  
  // OAuth2 scope granted for this token
  scope: z.string().nullable(),
  
  // Token type (typically 'Bearer')
  token_type: z.string().default('Bearer'),
  
  // Timestamps
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
});

// Type definition derived from the schema
export type JobberToken = z.infer<typeof jobberTokenSchema>;

// Type for creating a new token
export const createJobberTokenSchema = jobberTokenSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type CreateJobberToken = z.infer<typeof createJobberTokenSchema>;

// Type for updating an existing token
export const updateJobberTokenSchema = createJobberTokenSchema.partial();

export type UpdateJobberToken = z.infer<typeof updateJobberTokenSchema>;

// OAuth response from Jobber API
export const jobberOAuthResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(), // seconds until expiration
  scope: z.string().optional(),
  token_type: z.string().default('Bearer'),
});

export type JobberOAuthResponse = z.infer<typeof jobberOAuthResponseSchema>;

// Token refresh response from Jobber API
export const jobberTokenRefreshResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(), // Jobber may not always return a new refresh token
  expires_in: z.number(),
  scope: z.string().optional(),
  token_type: z.string().default('Bearer'),
});

export type JobberTokenRefreshResponse = z.infer<typeof jobberTokenRefreshResponseSchema>;

// Validation schema for storing tokens
export const storeJobberTokensSchema = z.object({
  access_token: z.string().min(1, 'Access token is required'),
  refresh_token: z.string().min(1, 'Refresh token is required'),
  expires_at: z.string().datetime(),
  scope: z.string().optional(),
  token_type: z.string().default('Bearer'),
});

export type StoreJobberTokens = z.infer<typeof storeJobberTokensSchema>; 