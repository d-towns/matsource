import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { JobberIntegrationState } from '@/lib/models/integrations';
import { jobberOAuthClient } from '@/lib/jobber/oauth';
import { 
  JobberToken, 
  StoreJobberTokens, 
  storeJobberTokensSchema
} from '@/lib/models/jobber_token';
import { cookies } from 'next/headers';

/**
 * Jobber Service
 * Handles all Jobber integration operations including token management,
 * authentication status checking, and API interactions
 */

/**
 * Get Jobber tokens for a specific team
 * @param teamId - Team ID to get tokens for
 * @returns Jobber token data or null if not found
 */
export async function getJobberTokensByTeamId(teamId: string): Promise<JobberToken | null> {
  try {
    const supabase = await createSupabaseSSRClient();

    const { data: tokenInfo, error: dbError } = await supabase
      .from('jobber_tokens')
      .select('*')
      .eq('team_id', teamId)
      .single();

    if (dbError) {
      if (dbError.code !== 'PGRST116') { // Not found error
        console.error('Database error fetching Jobber tokens:', dbError);
      }
      return null;
    }

    return tokenInfo as JobberToken;
  } catch (error) {
    console.error('Error in getJobberTokensByTeamId:', error);
    return null;
  }
}

/**
 * Check Jobber authentication status for a team
 * @param teamId - Team ID to check status for
 * @returns Integration state with connection status and details
 */
export async function checkJobberAuthStatus(teamId: string): Promise<JobberIntegrationState> {
  try {
    const tokenInfo = await getJobberTokensByTeamId(teamId);

    if (!tokenInfo) {
      return { 
        isConnected: false,
        error: undefined 
      };
    }

    // Check if token is expired (with 5-minute buffer)
    const expiresAt = new Date(tokenInfo.expires_at);
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const isExpired = expiresAt.getTime() <= (now.getTime() + bufferTime);

    if (isExpired) {
      console.log(`Jobber token expired for team: ${teamId}. Attempting refresh.`);
      
      // Attempt to refresh the token
      const refreshResult = await refreshJobberTokens(teamId, tokenInfo.refresh_token);
      
      if (!refreshResult.success) {
        return {
          isConnected: false,
          error: refreshResult.error || 'Token expired and refresh failed. Please reconnect.',
          expiresAt: tokenInfo.expires_at,
          scope: tokenInfo.scope || undefined,
        };
      }

      // Token was successfully refreshed
      return {
        isConnected: true,
        lastSynced: refreshResult.updatedToken?.updated_at || tokenInfo.updated_at,
        expiresAt: refreshResult.updatedToken?.expires_at || tokenInfo.expires_at,
        scope: refreshResult.updatedToken?.scope || tokenInfo.scope || undefined,
      };
    }

    // Token is valid and not expired
    return {
      isConnected: true,
      lastSynced: tokenInfo.updated_at,
      expiresAt: tokenInfo.expires_at,
      scope: tokenInfo.scope || undefined,
    };

  } catch (error) {
    console.error('Error in checkJobberAuthStatus for team:', teamId, error);
    return { 
      isConnected: false, 
      error: 'Failed to check authentication status due to an unexpected error.' 
    };
  }
}

/**
 * Refresh Jobber tokens for a team
 * @param teamId - Team ID to refresh tokens for
 * @param refreshToken - Current refresh token
 * @returns Success status and updated token info
 */
export async function refreshJobberTokens(
  teamId: string, 
  refreshToken: string
): Promise<{ success: boolean; error?: string; updatedToken?: JobberToken }> {
  try {
    // Attempt to refresh the token using OAuth client
    const refreshedTokens = await jobberOAuthClient.refreshAccessToken(refreshToken);

    // Calculate expiration timestamp
    const expiresAt = new Date(Date.now() + (refreshedTokens.expires_in * 1000));

    // Prepare token data for storage
    const tokenData: StoreJobberTokens = {
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token || refreshToken, // Use new refresh token if provided
      expires_at: expiresAt.toISOString(),
      scope: refreshedTokens.scope,
      token_type: refreshedTokens.token_type,
    };

    // Get current user ID for the update
    const supabase = await createSupabaseSSRClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { 
        success: false, 
        error: 'User authentication required for token refresh' 
      };
    }

    // Store the refreshed tokens
    const storeResult = await storeJobberTokens(user.id, teamId, tokenData);
    
    if (!storeResult.success) {
      return { 
        success: false, 
        error: storeResult.error || 'Failed to store refreshed tokens' 
      };
    }

    console.log(`Jobber tokens successfully refreshed for team: ${teamId}`);
    
    return { 
      success: true, 
      updatedToken: storeResult.token 
    };

  } catch (error) {
    console.error('Error refreshing Jobber tokens for team:', teamId, error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'INVALID_REFRESH_TOKEN') {
        return { 
          success: false, 
          error: 'Refresh token is invalid. Please reconnect your Jobber account.' 
        };
      }
    }
    
    return { 
      success: false, 
      error: 'Failed to refresh tokens due to an unexpected error.' 
    };
  }
}

/**
 * Store Jobber tokens in the database
 * @param userId - User ID who authorized the integration
 * @param teamId - Team ID that owns the integration
 * @param tokens - Token data to store
 * @returns Success status and stored token info
 */
export async function storeJobberTokens(
  userId: string,
  teamId: string,
  tokens: StoreJobberTokens
): Promise<{ success: boolean; error?: string; token?: JobberToken }> {
  try {
    // Validate token data
    const validatedTokens = storeJobberTokensSchema.parse(tokens);
    
    const supabase = await createSupabaseSSRClient();

    const tokenData = {
      user_id: userId,
      team_id: teamId,
      access_token: validatedTokens.access_token,
      refresh_token: validatedTokens.refresh_token,
      expires_at: validatedTokens.expires_at,
      scope: validatedTokens.scope || null,
      token_type: validatedTokens.token_type,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('jobber_tokens')
      .upsert(tokenData, { onConflict: 'team_id' })
      .select()
      .single();

    if (error) {
      console.error('Error storing Jobber tokens:', error);
      return { 
        success: false, 
        error: 'Failed to store tokens in database' 
      };
    }

    return { 
      success: true, 
      token: data as JobberToken 
    };

  } catch (error) {
    console.error('Error in storeJobberTokens:', error);
    return { 
      success: false, 
      error: 'Failed to store tokens due to validation or database error' 
    };
  }
}

/**
 * Disconnect Jobber integration for a team
 * @param teamId - Team ID to disconnect
 * @returns Success status
 */
export async function disconnectJobber(teamId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createSupabaseSSRClient();

    // Optionally revoke the token with Jobber before deleting
    const tokenInfo = await getJobberTokensByTeamId(teamId);
    if (tokenInfo?.access_token) {
      try {
        await jobberOAuthClient.revokeToken(tokenInfo.access_token);
      } catch (error) {
        console.warn('Failed to revoke Jobber token (continuing with disconnect):', error);
      }
    }

    // Delete tokens from database
    const { error } = await supabase
      .from('jobber_tokens')
      .delete()
      .eq('team_id', teamId);

    if (error) {
      console.error('Error disconnecting Jobber:', error);
      return { 
        success: false, 
        error: 'Failed to disconnect Jobber integration' 
      };
    }

    console.log(`Jobber integration disconnected for team: ${teamId}`);
    return { success: true };

  } catch (error) {
    console.error('Error in disconnectJobber:', error);
    return { 
      success: false, 
      error: 'Failed to disconnect due to an unexpected error' 
    };
  }
}

/**
 * Get Jobber integration state for the current user's active team
 * @param userId - User ID to get integration state for
 * @returns Integration state
 */
export async function getJobberIntegrationState(userId: string): Promise<JobberIntegrationState> {
  try {
    // Get active team from cookies
    const cookieStore = await cookies();
    const teamId = cookieStore.get('activeTeam')?.value;

    if (!teamId) {
      return { 
        isConnected: false, 
        error: 'No active team found' 
      };
    }

    return await checkJobberAuthStatus(teamId);

  } catch (error) {
    console.error('Error in getJobberIntegrationState for user:', userId, error);
    return { 
      isConnected: false, 
      error: 'Failed to check integration status due to an unexpected error.' 
    };
  }
}

/**
 * Test Jobber API connection
 * @param teamId - Team ID to test connection for
 * @returns Connection test result
 */
export async function testJobberConnection(teamId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const tokenInfo = await getJobberTokensByTeamId(teamId);
    
    if (!tokenInfo) {
      return { 
        success: false, 
        error: 'No Jobber integration found for this team' 
      };
    }

    const isConnected = await jobberOAuthClient.testConnection(tokenInfo.access_token);
    
    if (!isConnected) {
      return { 
        success: false, 
        error: 'Failed to connect to Jobber API. Token may be invalid.' 
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Error testing Jobber connection:', error);
    return { 
      success: false, 
      error: 'Failed to test connection due to an unexpected error' 
    };
  }
} 