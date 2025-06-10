export interface GoogleCalendarToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expiry_date: number;
  created_at: string;
  updated_at: string;
}

export interface JobberToken {
  id: string;
  user_id: string | null;
  team_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  scope: string | null;
  token_type: string;
  created_at: string | null;
  updated_at: string | null;
}

// Integration types
export type IntegrationType = 'google_calendar' | 'jobber';

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  status: 'active' | 'inactive';
  connected_at?: string;
  metadata?: Record<string, unknown>;
}

export interface IntegrationState {
  isConnected: boolean;
  lastSynced?: string;
  error?: string;
}

// Jobber-specific integration state
export interface JobberIntegrationState extends IntegrationState {
  scope?: string;
  expiresAt?: string;
}

// Union type for all integration states
export type AnyIntegrationState = IntegrationState | JobberIntegrationState; 