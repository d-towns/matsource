import { NextResponse } from 'next/server';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { jobberOAuthClient } from '@/lib/jobber/oauth';

/**
 * POST /api/integrations/jobber/auth
 * Initiates Jobber OAuth authentication flow
 */
export async function POST() {
  try {
    // Verify user is authenticated via Supabase
    const supabase = await createSupabaseSSRClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('Initiating Jobber OAuth for user:', user.id);

    // Generate Jobber authorization URL
    // Use user ID as state parameter for CSRF protection
    const authUrl = jobberOAuthClient.generateAuthUrl(user.id);

    console.log('Generated Jobber auth URL for user:', user.id);

    return NextResponse.json({ authUrl });

  } catch (error) {
    console.error('Jobber OAuth initiation error:', error);
    
    // Provide user-friendly error message
    const errorMessage = error instanceof Error 
      ? `Failed to initiate Jobber authentication: ${error.message}`
      : 'Failed to generate Jobber authentication URL';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
