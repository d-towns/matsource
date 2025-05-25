import { PhoneNumber } from '@/lib/models/phone_number';
import { CallerIdVerificationResult } from '@/lib/services/PhoneNumberService';

function checkStatus(res: Response) {
  if (!res.ok) throw new Error(res.statusText);
  return res;
}

// Fetch all phone numbers for a team
export async function fetchPhoneNumbers(teamId: string): Promise<PhoneNumber[]> {
  const res = await fetch(`/api/phone-numbers?teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Create a new phone number verification
export async function createPhoneNumber(
  input: { phoneNumber: string; friendlyName: string },
  teamId: string
): Promise<CallerIdVerificationResult> {
  const res = await fetch('/api/phone-numbers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, teamId }),
  });
  checkStatus(res);
  return res.json();
}

// Fetch a single phone number verification status
export async function fetchPhoneNumber(id: string, teamId: string): Promise<CallerIdVerificationResult> {
  const res = await fetch(`/api/phone-numbers/${id}?teamId=${encodeURIComponent(teamId)}`);
  checkStatus(res);
  return res.json();
}

// Retry verification for a phone number
export async function retryPhoneNumberVerification(id: string, teamId: string): Promise<CallerIdVerificationResult> {
  const res = await fetch(`/api/phone-numbers/${id}/retry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId }),
  });
  checkStatus(res);
  return res.json();
}

// Delete a phone number
export async function deletePhoneNumber(id: string, teamId: string): Promise<void> {
  const res = await fetch(`/api/phone-numbers/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId }),
  });
  checkStatus(res);
} 