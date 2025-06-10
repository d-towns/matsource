import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { disconnectJobber } from '@/lib/services/jobberService';
import { cookies } from 'next/headers';

/**
 * POST /api/integrations/jobber/disconnect
 * Disconnects Jobber integration for the user's active team
 */
export async function POST(_request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createSupabaseSSRClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get active team from cookies
    const cookieStore = await cookies();
    const teamId = cookieStore.get('activeTeam')?.value;

    if (!teamId) {
      console.error('No active team found for user:', user.id);
      return NextResponse.json(
        { error: 'No active team found. Please select a team.' },
        { status: 400 }
      );
    }

    console.log('Disconnecting Jobber integration for user:', user.id, 'team:', teamId);

    // Disconnect Jobber integration
    const disconnectResult = await disconnectJobber(teamId);

    if (!disconnectResult.success) {
      console.error('Failed to disconnect Jobber:', disconnectResult.error);
      return NextResponse.json(
        { error: disconnectResult.error || 'Failed to disconnect Jobber integration' },
        { status: 500 }
      );
    }

    console.log('Jobber integration disconnected successfully for team:', teamId);

    return NextResponse.json({ 
      success: true,
      message: 'Jobber integration disconnected successfully'
    });

  } catch (error) {
    console.error('Error disconnecting Jobber integration:', error);
    
    // Provide user-friendly error message
    const errorMessage = error instanceof Error 
      ? `Failed to disconnect Jobber: ${error.message}`
      : 'An unexpected error occurred while disconnecting Jobber';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 