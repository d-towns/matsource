import { validateRequest } from 'twilio';
import { config } from '@/lib/config';

/**
 * Verify Twilio webhook signature using Twilio's built-in validation
 * @param payload - Raw request body as string
 * @param headers - Request headers object
 * @param url - The full URL of the webhook endpoint
 * @returns boolean indicating if signature is valid
 */
export function verifyTwilioSignature(
  payload: string, 
  headers: Record<string, string | string[] | undefined>,
  url?: string
): boolean {
  const twilioSignature = headers['x-twilio-signature'] as string;
  console.log('headers', headers);
  if (!twilioSignature) {
    console.error('Missing X-Twilio-Signature header');
    return false;
  }

  console.log('twilioSignature', twilioSignature);
  const authToken = config.services.twilio.authToken;
  if (!authToken) {
    console.error('Missing Twilio auth token');
    return false;
  }
  console.log('found auth token')
  // If URL is not provided, try to construct it from headers
  const requestUrl = url || constructUrlFromHeaders(headers);
  if (!requestUrl) {
    console.error('Could not determine request URL for signature verification');
    return false;
  }
  console.log('payload', payload);
  console.log('url', requestUrl);

  try {
    // Use Twilio's built-in validateRequest function
    // Convert payload to URLSearchParams for form data
    const params = new URLSearchParams(payload);
    const paramsObject: Record<string, string> = {};
    
    // Convert URLSearchParams to plain object
    for (const [key, value] of params.entries()) {
      paramsObject[key] = value;
    }
    console.log('paramsObject', paramsObject);
    return validateRequest(
      authToken,
      twilioSignature,
      requestUrl,
      paramsObject
    );
  } catch (error) {
    console.error('Error verifying Twilio signature:', error);
    return false;
  }
}

/**
 * Construct URL from request headers (fallback method)
 */
function constructUrlFromHeaders(headers: Record<string, string | string[] | undefined>): string | null {
  const host = headers.host as string;
  const protocol = headers['x-forwarded-proto'] || 'https';
  const path = headers['x-original-uri'] || '/api/twilio/caller-id/callback';
  
  if (!host) {
    return null;
  }
  
  return `${protocol}://${host}${path}`;
} 