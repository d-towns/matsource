import { NextResponse } from 'next/server';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { getJobberIntegrationState } from '@/lib/services/jobberService';

/**
 * GET /api/integrations/jobber/status
 * Returns the current Jobber integration status for the user's active team
 */
export async function GET() {
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

    console.log('Checking Jobber integration status for user:', user.id);

    // Get integration status for the user's active team
    const integrationState = await getJobberIntegrationState(user.id);

    console.log('Jobber integration state:', {
      userId: user.id,
      isConnected: integrationState.isConnected,
      hasError: !!integrationState.error
    });

    return NextResponse.json(integrationState);

  } catch (error) {
    console.error('Error checking Jobber integration status:', error);
    
    // Return a safe error state
    const errorMessage = error instanceof Error 
      ? `Failed to check integration status: ${error.message}`
      : 'Failed to check Jobber integration status';

    return NextResponse.json(
      { 
        isConnected: false, 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
} 