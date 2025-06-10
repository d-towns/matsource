import { config } from '@/lib/config';
import { 
  JobberOAuthResponse, 
  JobberTokenRefreshResponse,
  jobberOAuthResponseSchema,
  jobberTokenRefreshResponseSchema 
} from '@/lib/models/jobber_token';
import {decode} from 'jsonwebtoken'
/**
 * Jobber OAuth Client
 * Handles OAuth2 flow for Jobber API integration
 */
export class JobberOAuthClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseUrl: string;
  private readonly authUrl: string;
  private readonly tokenUrl: string;
  private readonly callbackUrl: string;
  private readonly scopes: string;

  constructor() {
    this.clientId = config.services.jobber.clientId;
    this.clientSecret = config.services.jobber.clientSecret;
    this.baseUrl = config.services.jobber.baseUrl;
    this.authUrl = config.services.jobber.authUrl;
    this.tokenUrl = config.services.jobber.tokenUrl;
    this.callbackUrl = config.services.jobber.callbackUrl;
    this.scopes = config.services.jobber.scopes;
  }

  /**
   * Generate authorization URL for OAuth flow
   * @param state - State parameter for CSRF protection (typically user ID)
   * @returns Authorization URL
   */
  generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      response_type: 'code',
      scope: this.scopes,
      state: state,
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access tokens
   * @param code - Authorization code from callback
   * @returns Token response from Jobber
   */
  async exchangeCodeForTokens(code: string): Promise<JobberOAuthResponse> {
    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: this.callbackUrl,
        }).toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Jobber token exchange failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const payload = decode(data.access_token)
      console.log('payload', payload)
      const token = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: payload.exp,
        scope: payload.scope,
        token_type: 'Bearer',
      }

      
      // Validate response with Zod schema
      console.log('token', token)
      const validatedData = jobberOAuthResponseSchema.parse(token);
      
      return validatedData;
    } catch (error) {
      console.error('Error exchanging Jobber authorization code:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Current refresh token
   * @returns New token response from Jobber
   */
  async refreshAccessToken(refreshToken: string): Promise<JobberTokenRefreshResponse> {
    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Check for specific error types
        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.error === 'invalid_grant') {
            throw new Error('INVALID_REFRESH_TOKEN');
          }
        }
        
        throw new Error(`Jobber token refresh failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Validate response with Zod schema
      const validatedData = jobberTokenRefreshResponseSchema.parse(data);
      
      return validatedData;
    } catch (error) {
      console.error('Error refreshing Jobber access token:', error);
      
      // Re-throw specific errors
      if (error instanceof Error && error.message === 'INVALID_REFRESH_TOKEN') {
        throw error;
      }
      
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Revoke access token (optional - for cleanup)
   * @param accessToken - Access token to revoke
   */
  async revokeToken(accessToken: string): Promise<boolean> {
    try {
      // Note: Jobber may not have a revoke endpoint, this is optional
      // Check Jobber API documentation for revoke endpoint
      const revokeUrl = `${this.baseUrl}/api/oauth/revoke`;
      
      const response = await fetch(revokeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: new URLSearchParams({
          token: accessToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error revoking Jobber token:', error);
      return false;
    }
  }

  /**
   * Test API connection with access token
   * @param accessToken - Access token to test
   * @returns Whether the token is valid
   */
  async testConnection(accessToken: string): Promise<boolean> {
    try {
      // Test with a simple API call (e.g., get user info or account info)
      const response = await fetch(`${this.baseUrl}/api/graphql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              account {
                id
                name
              }
            }
          `,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error testing Jobber connection:', error);
      return false;
    }
  }
}

// Export singleton instance
export const jobberOAuthClient = new JobberOAuthClient(); 