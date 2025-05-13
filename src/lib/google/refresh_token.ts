import { google } from 'googleapis';
import { storeGoogleCalendarTokens } from '@/lib/services/integrations'; // We'll call this after refreshing

// Create OAuth2 client
// Ensure these environment variables are accessible here
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // The redirect URI is not strictly needed for refreshing tokens, 
  // but it's good practice to include it if the client is used for other auth flows.
  // For server-side refresh, it might not be used.
  `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : 'http://localhost:3000'}/api/integrations/google/callback`
);

interface RefreshTokenResponse {
  access_token: string;
  expiry_date: number;
  refresh_token?: string; // Google might or might not return a new refresh token
}

/**
 * Refreshes the Google access token using the provided refresh token.
 * @param userId - The ID of the user for whom to refresh the token.
 * @param existingRefreshToken - The existing refresh token.
 * @returns The new token details or null if refresh fails.
 */
export async function refreshGoogleAccessToken(
  userId: string,
  existingRefreshToken: string
): Promise<RefreshTokenResponse | null> {
  try {
    oauth2Client.setCredentials({
      refresh_token: existingRefreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    if (!credentials.access_token || !credentials.expiry_date) {
      console.error('Failed to refresh Google access token: Missing token information from Google.');
      return null;
    }

    const newTokens = {
      access_token: credentials.access_token,
      expiry_date: credentials.expiry_date,
      // Important: Google might not always return a new refresh_token.
      // If it doesn't, we must continue using the old one.
      refresh_token: credentials.refresh_token || existingRefreshToken, 
    };

    // Store the newly refreshed (and potentially new refresh) tokens
    const stored = await storeGoogleCalendarTokens(userId, newTokens);
    if (!stored) {
      console.error('Failed to store refreshed Google tokens for user:', userId);
      // Even if storing fails, we have the new tokens in memory for the current operation
      // but this indicates a DB issue that needs attention.
    }
    
    return {
        access_token: newTokens.access_token,
        expiry_date: newTokens.expiry_date,
        refresh_token: newTokens.refresh_token 
    };

  } catch (error) {
    console.error('Error refreshing Google access token for user:', userId, error);
    // Check for specific errors like 'invalid_grant' which means the refresh token is no longer valid
    if (error.response?.data?.error === 'invalid_grant') {
      console.warn('Google refresh token is invalid for user:', userId, 'Requires re-authentication.');
      // Optionally, you could trigger a process here to notify the user or clear the invalid tokens.
      // For now, we'll just return null, and the calling function should handle re-auth flow.
    }
    return null;
  }
} 