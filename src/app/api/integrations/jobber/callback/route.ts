import { NextRequest, NextResponse } from 'next/server';
import { jobberOAuthClient } from '@/lib/jobber/oauth';
import { storeJobberTokens } from '@/lib/services/jobberService';
import { cookies } from 'next/headers';
import { config } from '@/lib/config';

/**
 * GET /api/integrations/jobber/callback
 * Handles Jobber OAuth callback and token exchange
 */
export async function GET(request: NextRequest) {
  // Get query parameters from the callback URL
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // This is the userId we passed
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const baseUrl = config.app.baseUrl;
  const redirectBase = '/workspaces/integrations';

  // Handle OAuth errors from Jobber
  if (error) {
    console.error('Jobber OAuth error:', error, errorDescription);
    
    const errorParam = error === 'access_denied' 
      ? 'jobber_auth_denied' 
      : 'jobber_auth_error';
    
    return NextResponse.redirect(
      new URL(`${redirectBase}?error=${errorParam}`, baseUrl)
    );
  }

  // Validate required parameters
  if (!code || !state) {
    console.error('Missing required callback parameters:', { code: !!code, state: !!state });
    return NextResponse.redirect(
      new URL(`${redirectBase}?error=invalid_callback`, baseUrl)
    );
  }

  try {
    console.log('Processing Jobber callback for user:', state);

    // Exchange authorization code for tokens
    const tokenResponse = await jobberOAuthClient.exchangeCodeForTokens(code);
    
    if (!tokenResponse.access_token || !tokenResponse.refresh_token) {
      throw new Error('Missing required token information from Jobber');
    }

    console.log('Successfully exchanged code for Jobber tokens');

    // Calculate expiration timestamp
    const expiresAt = new Date(Date.now() + (tokenResponse.expires_in));

    // Get active team from cookies
    const cookieStore = await cookies();
    const teamId = cookieStore.get('activeTeam')?.value;

    if (!teamId) {
      console.error('No active team found for user:', state);
      return NextResponse.redirect(
        new URL(`${redirectBase}?error=no_active_team`, baseUrl)
      );
    }

    // Store tokens in database
    const storeResult = await storeJobberTokens(state, teamId, {
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_at: expiresAt.toISOString(),
      scope: tokenResponse.scope,
      token_type: tokenResponse.token_type,
    });
    console.log('storeResult', storeResult)

    if (!storeResult.success) {
      console.error('Failed to store Jobber tokens:', storeResult.error);
      return NextResponse.redirect(
        new URL(`${redirectBase}?error=token_storage_failed`, baseUrl)
      );
    }

    console.log('Jobber tokens stored successfully for team:', teamId);

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`${redirectBase}?success=jobber_connected`, baseUrl)
    );

  } catch (error) {
    console.error('Error handling Jobber callback:', error);
    
    // Determine specific error type for better user feedback
    let errorParam = 'token_exchange_failed';
    
    if (error instanceof Error) {
      if (error.message.includes('token information')) {
        errorParam = 'invalid_token_response';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorParam = 'network_error';
      }
    }
    
    return NextResponse.redirect(
      new URL(`${redirectBase}?error=${errorParam}`, baseUrl)
    );
  }
}
