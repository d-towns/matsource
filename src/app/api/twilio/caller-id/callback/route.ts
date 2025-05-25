import { NextRequest } from 'next/server';
import { verifyTwilioSignature } from '@/lib/twilio/auth';
import { updateVerificationStatus } from '@/lib/services/PhoneNumberService';
import { VerificationStatus } from '@/lib/models/phone_number';
const NGROK_URL = 'https://ac96-2601-403-c400-59b0-85fb-adda-976f-6d0d.ngrok-free.app'
export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const headers = Object.fromEntries(req.headers.entries());
    
    // Verify Twilio signature
    const url = `${NGROK_URL}/api/twilio/caller-id/callback`;
    if (!verifyTwilioSignature(rawBody, headers, url)) {
      console.error('Invalid Twilio signature');
      return new Response('Forbidden', { status: 403 });
    }

    // Parse form data
    const params = new URLSearchParams(rawBody);
    const verificationStatus = params.get('VerificationStatus');
    const outgoingCallerIdSid = params.get('OutgoingCallerIdSid');
    const callSid = params.get('CallSid');

    console.log('Twilio callback received:', {
      verificationStatus,
      outgoingCallerIdSid,
      callSid,
    });

    if (!callSid) {
      console.error('Missing CallSid in Twilio callback');
      return new Response('Bad Request: Missing CallSid', { status: 400 });
    }

    if (!verificationStatus) {
      console.error('Missing VerificationStatus in Twilio callback');
      return new Response('Bad Request: Missing VerificationStatus', { status: 400 });
    }

    // Map Twilio status to our enum
    let status: VerificationStatus;
    switch (verificationStatus.toLowerCase()) {
      case 'success':
        status = 'success';
        break;
      case 'failed':
        status = 'failed';
        break;
      default:
        console.warn(`Unknown verification status: ${verificationStatus}`);
        status = 'failed';
    }

    // Update verification status in database
    await updateVerificationStatus(
      callSid,
      status,
      status === 'success' ? outgoingCallerIdSid || undefined : undefined
    );

    console.log(`Updated verification status for call ${callSid}: ${status}`);

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Error processing Twilio callback:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 