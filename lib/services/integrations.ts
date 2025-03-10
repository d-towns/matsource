import { createClient } from '@/lib/supabase/client';
import { IntegrationState } from '@/lib/models/integrations';
// GoogleCalendarToken and Integration interfaces are imported but not directly used in this file

export async function getGoogleCalendarIntegrationState(userId: string): Promise<IntegrationState> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('google_calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return { isConnected: false };
    }

    // Check if token is expired (with 5 minute buffer)
    const isExpired = data.expiry_date < (Date.now() + 300000);

    return {
      isConnected: !isExpired,
      lastSynced: data.updated_at,
      error: isExpired ? 'Token expired. Please reconnect.' : undefined
    };
  } catch (error) {
    console.error('Error getting Google Calendar integration state:', error);
    return { 
      isConnected: false, 
      error: 'Failed to check integration status' 
    };
  }
}

export async function disconnectGoogleCalendar(userId: string): Promise<boolean> {
  try {
    const supabase = createClient();
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
    refresh_token: string;
    expiry_date: number;
  }
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('google_calendar_tokens')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
        updated_at: new Date().toISOString()
      });

    return !error;
  } catch (error) {
    console.error('Error storing Google Calendar tokens:', error);
    return false;
  }
} 