import { z } from 'zod';

/**
 * Schema for the Google Calendar tokens table
 * Stores OAuth2 tokens for accessing Google Calendar API
 */
export const googleCalendarTokenSchema = z.object({
  // Primary key, auto-generated UUID
  id: z.string().uuid(),
  
  // Foreign key to users table
  user_id: z.string().uuid(),
  
  // OAuth2 tokens
  access_token: z.string(),
  refresh_token: z.string(),
  
  // Token expiration timestamp (milliseconds since epoch)
  expiry_date: z.number().int(),
  
  // Timestamps
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
});

// Type definition derived from the schema
export type GoogleCalendarToken = z.infer<typeof googleCalendarTokenSchema>;

// Type for creating a new token
export const createGoogleCalendarTokenSchema = googleCalendarTokenSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type CreateGoogleCalendarToken = z.infer<typeof createGoogleCalendarTokenSchema>;

// Type for updating an existing token
export const updateGoogleCalendarTokenSchema = createGoogleCalendarTokenSchema.partial();

export type UpdateGoogleCalendarToken = z.infer<typeof updateGoogleCalendarTokenSchema>;
