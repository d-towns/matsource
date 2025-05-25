import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { PhoneNumber, PhoneNumberSchema, VerificationStatus } from '@/lib/models/phone_number';
import { twilioClient } from '@/lib/twilio/client';
import { config } from '@/lib/config';

export interface CreateCallerIdRequest {
  teamId: string;
  phoneNumber: string;
  friendlyName: string;
}

export interface CallerIdVerificationResult {
  id: string;
  status: VerificationStatus;
  callSid?: string;
  validationCode?: string;
  phoneNumber?: string;
  friendlyName?: string;
}

export interface CreateTwilioPhoneNumberRequest {
  teamId: string;
  phoneNumber: string;
  twilioPhoneNumberSid: string;
  twilioSubaccountSid: string;
  friendlyName?: string;
}

const NGROK_URL = 'https://ac96-2601-403-c400-59b0-85fb-adda-976f-6d0d.ngrok-free.app'

/**
 * Start the caller ID verification process
 */
export async function startCallerIdVerification(
  request: CreateCallerIdRequest
): Promise<CallerIdVerificationResult> {
  const { teamId, phoneNumber, friendlyName } = request;
  console.log(teamId, phoneNumber, friendlyName) 
  try {
    // Create Twilio validation request
    console.log(config.app.baseUrl)
    const validationRequest = await twilioClient.validationRequests.create({
      phoneNumber,
      friendlyName,
      statusCallback: `${NGROK_URL}/api/twilio/caller-id/callback`,
      statusCallbackMethod: 'POST',
    });

    const { phoneNumber: twilioPhoneNumber, validationCode, callSid } = validationRequest;

    // Store in database
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('phone_numbers')
      .insert({
        team_id: teamId,
        phone_number: twilioPhoneNumber,
        phone_number_type: 'verified_caller_id',
        friendly_name: friendlyName,
        validation_code: validationCode,
        call_sid: callSid,
        verification_status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing phone number:', error);
      throw new Error('Failed to store phone number verification request');
    }

    return {
      id: data.id,
      status: 'pending' as VerificationStatus,
      callSid: callSid,
      validationCode: validationCode,
      phoneNumber: twilioPhoneNumber,
      friendlyName: friendlyName,
    };
  } catch (error) {
    console.error('Error starting caller ID verification:', error);
    throw new Error('Failed to start caller ID verification');
  }
}

/**
 * Create a Twilio-purchased phone number record
 */
export async function createTwilioPhoneNumber(
  request: CreateTwilioPhoneNumberRequest
): Promise<PhoneNumber> {
  const { teamId, phoneNumber, twilioPhoneNumberSid, twilioSubaccountSid, friendlyName } = request;
  
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('phone_numbers')
      .insert({
        team_id: teamId,
        phone_number: phoneNumber,
        phone_number_type: 'twilio_purchased',
        twilio_phone_number_sid: twilioPhoneNumberSid,
        twilio_subaccount_sid: twilioSubaccountSid,
        friendly_name: friendlyName || 'Twilio Business Number',
        verification_status: 'success', // Twilio numbers are automatically "verified"
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing Twilio phone number:', error);
      throw new Error('Failed to store Twilio phone number');
    }

    return PhoneNumberSchema.parse(data);
  } catch (error) {
    console.error('Error creating Twilio phone number record:', error);
    throw new Error('Failed to create Twilio phone number record');
  }
}

/**
 * Update verification status from Twilio callback
 */
export async function updateVerificationStatus(
  callSid: string,
  status: VerificationStatus,
  outgoingCallerIdSid?: string
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  
  const updateData: Partial<PhoneNumber> = {
    verification_status: status,
  };

  if (status === 'success' && outgoingCallerIdSid) {
    updateData.outgoing_caller_id_sid = outgoingCallerIdSid;
  }

  const { error } = await supabase
    .from('phone_numbers')
    .update(updateData)
    .eq('call_sid', callSid);

  if (error) {
    console.error('Error updating verification status:', error);
    throw new Error('Failed to update verification status');
  }
}

/**
 * Get verification status by phone number ID
 */
export async function getVerificationStatus(id: string, teamId: string): Promise<CallerIdVerificationResult> {
  const supabase = await createSupabaseSSRClient();
  
  const { data, error } = await supabase
    .from('phone_numbers')
    .select('id, verification_status, call_sid, validation_code, phone_number, friendly_name')
    .eq('id', id)
    .eq('team_id', teamId)
    .single();

  if (error || !data) {
    throw new Error('Phone number verification not found');
  }

  return {
    id: data.id,
    status: data.verification_status as VerificationStatus,
    callSid: data.call_sid || undefined,
    validationCode: data.validation_code || undefined,
    phoneNumber: data.phone_number || undefined,
    friendlyName: data.friendly_name || undefined,
  };
}

/**
 * Get all verified phone numbers for a team
 */
export async function getVerifiedPhoneNumbers(teamId: string): Promise<PhoneNumber[]> {
  const supabase = await createSupabaseSSRClient();
  
  const { data, error } = await supabase
    .from('phone_numbers')
    .select('*')
    .eq('team_id', teamId)
    .eq('verification_status', 'success');

  if (error) {
    console.error('Error fetching verified phone numbers:', error);
    throw new Error('Failed to fetch verified phone numbers');
  }

  return (data || []).map(d => PhoneNumberSchema.parse(d));
}

/**
 * Get all phone numbers for a team (any status)
 */
export async function getPhoneNumbers(teamId: string): Promise<PhoneNumber[]> {
  const supabase = await createSupabaseSSRClient();
  
  const { data, error } = await supabase
    .from('phone_numbers')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching phone numbers:', error);
    throw new Error('Failed to fetch phone numbers');
  }

  return (data || []).map(d => PhoneNumberSchema.parse(d));
}

/**
 * Retry verification for a failed phone number
 */
export async function retryVerification(id: string, teamId: string): Promise<CallerIdVerificationResult> {
  const supabase = getSupabaseAdminClient();
  
  // Get the existing phone number
  const { data: existingData, error: fetchError } = await supabase
    .from('phone_numbers')
    .select('*')
    .eq('id', id)
    .eq('team_id', teamId)
    .single();

  if (fetchError || !existingData) {
    throw new Error('Phone number not found');
  }

  const phoneNumber = PhoneNumberSchema.parse(existingData);

  // Start new verification
  try {
    const validationRequest = await twilioClient.validationRequests.create({
      phoneNumber: phoneNumber.phone_number,
      friendlyName: phoneNumber.friendly_name || 'Business Phone',
      statusCallback: `${NGROK_URL}/api/twilio/caller-id/callback`,
      statusCallbackMethod: 'POST',
    });

    // Update the existing record
    const { error: updateError } = await supabase
      .from('phone_numbers')
      .update({
        validation_code: validationRequest.validationCode,
        call_sid: validationRequest.callSid,
        verification_status: 'pending',
        outgoing_caller_id_sid: null, // Clear previous SID
      })
      .eq('id', id);

    if (updateError) {
      throw new Error('Failed to update phone number for retry');
    }

    return {
      id,
      status: 'pending' as VerificationStatus,
      callSid: validationRequest.callSid,
      validationCode: validationRequest.validationCode,
      phoneNumber: phoneNumber.phone_number,
      friendlyName: phoneNumber.friendly_name || 'Business Phone',
    };
  } catch (error) {
    console.error('Error retrying verification:', error);
    throw new Error('Failed to retry verification');
  }
}

/**
 * Delete a phone number
 */
export async function deletePhoneNumber(id: string, teamId: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  
  const { error } = await supabase
    .from('phone_numbers')
    .delete()
    .eq('id', id)
    .eq('team_id', teamId);

  if (error) {
    console.error('Error deleting phone number:', error);
    throw new Error('Failed to delete phone number');
  }
}

/**
 * Get only verified caller ID numbers for a team
 */
export async function getVerifiedCallerIdNumbers(teamId: string): Promise<PhoneNumber[]> {
  const allNumbers = await getPhoneNumbers(teamId);
  return allNumbers.filter(num => 
    num.phone_number_type === 'verified_caller_id' && 
    num.verification_status === 'success'
  );
}

/**
 * Get only Twilio-purchased numbers for a team
 */
export async function getTwilioPhoneNumbers(teamId: string): Promise<PhoneNumber[]> {
  const allNumbers = await getPhoneNumbers(teamId);
  return allNumbers.filter(num => num.phone_number_type === 'twilio_purchased');
}

/**
 * Get the team's default phone number for outbound calls
 */
export async function getDefaultPhoneNumber(teamId: string): Promise<PhoneNumber | null> {
  const supabase = await createSupabaseSSRClient();
  
  const { data: team } = await supabase
    .from('teams')
    .select('default_phone_number_id')
    .eq('id', teamId)
    .single();
    
  if (!team?.default_phone_number_id) {
    // Fallback: return first available phone number
    const numbers = await getPhoneNumbers(teamId);
    return numbers.find(num => num.verification_status === 'success') || null;
  }
  
  const numbers = await getPhoneNumbers(teamId);
  return numbers.find(num => num.id === team.default_phone_number_id) || null;
}

/**
 * Set the team's default phone number for outbound calls
 */
export async function setDefaultPhoneNumber(teamId: string, phoneNumberId: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  
  const { error } = await supabase
    .from('teams')
    .update({ default_phone_number_id: phoneNumberId })
    .eq('id', teamId);

  if (error) {
    console.error('Error setting default phone number:', error);
    throw new Error('Failed to set default phone number');
  }
} 