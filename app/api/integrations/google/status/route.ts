import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getGoogleCalendarIntegrationState } from '@/lib/services/integrations';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get integration status
    const integrationState = await getGoogleCalendarIntegrationState(user.id);

    return NextResponse.json(integrationState);
  } catch (error) {
    console.error('Error checking Google Calendar status:', error);
    return NextResponse.json(
      { isConnected: false, error: 'Failed to check integration status' },
      { status: 500 }
    );
  }
} 