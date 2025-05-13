import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { IntegrationState } from '@/lib/models/integrations';
import { refreshGoogleAccessToken } from '@/lib/google/refresh_token';
// GoogleCalendarToken and Integration interfaces are imported but not directly used in this file

export async function getGoogleCalendarIntegrationState(userId: string): Promise<IntegrationState> {
  try {
    const supabase = await createSupabaseSSRClient();

    // 1. Get team_id for the current user
    const { data: userData, error: userFetchError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', userId)
      .single();

    if (userFetchError || !userData?.team_id) {
      console.error('Failed to fetch team_id for user:', userId, userFetchError);
      return { isConnected: false, error: 'Could not determine user\'s team.' };
    }
    const teamId = userData.team_id;

    // 2. Fetch token information for the team
    const { data: tokenInfo, error: dbError } = await supabase
      .from('google_calendar_tokens')
      .select('access_token, refresh_token, expiry_date, updated_at') // user_id in token table tracks who last authorized
      .eq('team_id', teamId)
      .single();

    if (dbError || !tokenInfo) {
      if (dbError && dbError.code !== 'PGRST116') {
        console.error('Database error fetching Google tokens:', dbError);
      }
      return { isConnected: false, error: dbError && dbError.code !== 'PGRST116' ? 'Failed to retrieve token from DB' : undefined };
    }

    let currentExpiryDate = tokenInfo.expiry_date;
    const currentRefreshToken = tokenInfo.refresh_token;
    let lastUpdatedAt = tokenInfo.updated_at;

    const isExpired = currentExpiryDate < (Date.now() + 300000);

    if (isExpired) {
      if (!currentRefreshToken) {
        console.warn('Google token expired for user:', userId, 'and no refresh token available. Requires re-authentication.');
        return { 
          isConnected: false, 
          error: 'Token expired and no refresh token. Please reconnect.'
        };
      }
      
      console.log('Google token expired for user:', userId, 'Attempting refresh.');
      const refreshedTokens = await refreshGoogleAccessToken(userId, currentRefreshToken);

      if (refreshedTokens) {
        console.log('Google token successfully refreshed for user:', userId);
        currentExpiryDate = refreshedTokens.expiry_date;
        lastUpdatedAt = new Date().toISOString();
      } else {
        console.warn('Failed to refresh Google token for user:', userId, 'Requires re-authentication.');
        return { 
          isConnected: false, 
          error: 'Failed to refresh token. Please disconnect and reconnect Google Calendar.' 
        };
      }
    }

    const stillExpiredAfterAttempt = currentExpiryDate < (Date.now() + 300000);

    if (stillExpiredAfterAttempt) {
        return {
            isConnected: false,
            error: 'Token is still expired after refresh attempt. Please reconnect.'
        };
    }

    return {
      isConnected: true,
      lastSynced: lastUpdatedAt,
    };

  } catch (error) {
    console.error('Error in getGoogleCalendarIntegrationState for user:', userId, error);
    return { 
      isConnected: false, 
      error: 'Failed to check integration status due to an unexpected error.' 
    };
  }
}

export async function disconnectGoogleCalendar(userId: string): Promise<boolean> {
  try {
    const supabase = await createSupabaseSSRClient();
    const { error } = await supabase
      .from('google_calendar_tokens')
      .delete()
      .eq('user_id', userId);

    return !error;
  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error);
    return false;
  }
}

export async function storeGoogleCalendarTokens(
  userId: string, 
  tokens: {
    access_token: string;
    refresh_token: string; // This will be the new one, or the existing one if Google didn't issue a new one
    expiry_date: number;
  }
): Promise<boolean> {
  try {
    const supabase = await createSupabaseSSRClient();

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('team_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('Error getting user team_id for storing tokens:', userError);
      return false;
    }

    const tokenData = {
      user_id: userId,
      team_id: userData.team_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('google_calendar_tokens')
      .upsert(tokenData, { onConflict: 'team_id' }); 

    if (error) {
      console.error('Error upserting Google Calendar tokens:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in storeGoogleCalendarTokens:', error);
    return false;
  }
} 