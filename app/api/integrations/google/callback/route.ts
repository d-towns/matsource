import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { storeGoogleCalendarTokens } from '@/lib/services/integrations';

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/integrations/google/callback`
);

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // This is the userId we passed
  const error = searchParams.get('error');

  // Handle errors from Google
  if (error) {
    console.error('Google authentication error:', error);
    return NextResponse.redirect(new URL('/workspaces/integrations?error=google_auth_denied', request.url));
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(new URL('/workspaces/integrations?error=invalid_callback', request.url));
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token || !tokens.refresh_token || !tokens.expiry_date) {
      throw new Error('Missing required token information');
    }

    // Store tokens in database
    await storeGoogleCalendarTokens(state, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    });

    // Redirect to success page
    return NextResponse.redirect(new URL('/workspaces/integrations?success=google_calendar_connected', request.url));
  } catch (error) {
    console.error('Error handling Google callback:', error);
    return NextResponse.redirect(new URL('/workspaces/integrations?error=token_exchange_failed', request.url));
  }
} 