export interface GoogleCalendarToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expiry_date: number;
  created_at: string;
  updated_at: string;
}

// We'll keep this interface for potential future use
export interface Integration {
  id: string;
  name: string;
  type: 'google_calendar';
  status: 'active' | 'inactive';
  connected_at?: string;
  metadata?: Record<string, unknown>; // Use unknown instead of any
}

export interface IntegrationState {
  isConnected: boolean;
  lastSynced?: string;
  error?: string;
} 