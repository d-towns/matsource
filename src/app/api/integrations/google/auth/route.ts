import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : 'http://localhost:3000'}/api/integrations/google/callback`
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    // Verify user is authenticated via Supabase
    const supabase = await createSupabaseSSRClient();
    const { data: { user } } = await supabase.auth.getUser();
    console.log('user', user)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Generate authentication URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      include_granted_scopes: true,
      state: user.id, // Pass user ID as state for security verification
      prompt: 'consent', // Force Google to display the consent screen
    });

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Google Calendar auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
} 