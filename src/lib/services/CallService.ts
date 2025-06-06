import { PhoneNumber } from '@/lib/models/phone_number';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export interface CallParameters {
  to_number: string;
  from_number: string;
  team_id: string;
  form_id?: string;
  lead_id?: string;
  // Twilio-specific parameters
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  caller_id_sid?: string;
  phone_number_sid?: string;
}

/**
 * Get call parameters based on phone number type
 */
export async function getCallParameters(
  phoneNumber: PhoneNumber,
  teamId: string,
  toNumber: string,
  additionalParams: {
    form_id?: string;
    lead_id?: string;
  } = {}
): Promise<CallParameters> {
  const baseParams: CallParameters = {
    to_number: toNumber,
    from_number: phoneNumber.phone_number,
    team_id: teamId,
    ...additionalParams,
  };

  if (phoneNumber.phone_number_type === 'twilio_purchased') {
    // For Twilio purchased numbers, we need subaccount credentials
    const supabase = getSupabaseAdminClient();
    
    const { data: team, error } = await supabase
      .from('teams')
      .select('twilio_subaccount_sid, twilio_subaccount_auth_token')
      .eq('id', teamId)
      .single();

    if (error || !team?.twilio_subaccount_sid || !team?.twilio_subaccount_auth_token) {
      throw new Error('Team subaccount not found or not configured');
    }

    return {
      ...baseParams,
      twilio_account_sid: team.twilio_subaccount_sid,
      twilio_auth_token: team.twilio_subaccount_auth_token,
      phone_number_sid: phoneNumber.twilio_phone_number_sid || undefined,
    };
  }

  if (phoneNumber.phone_number_type === 'verified_caller_id') {
    // For verified caller IDs, we use the main account with caller ID SID
    if (!phoneNumber.outgoing_caller_id_sid) {
      throw new Error('Verified caller ID does not have outgoing caller ID SID');
    }

    return {
      ...baseParams,
      caller_id_sid: phoneNumber.outgoing_caller_id_sid,
    };
  }

  throw new Error(`Unsupported phone number type: ${phoneNumber.phone_number_type}`);
}

/**
 * Create an outbound call using the voice agent service
 */
export async function createOutboundCall(
  phoneNumber: PhoneNumber,
  teamId: string,
  toNumber: string,
  additionalParams: {
    form_id?: string;
    lead_id?: string;
    agent_id?: string;
  } = {}
): Promise<Record<string, unknown>> {
  try {
    const callParams = await getCallParameters(phoneNumber, teamId, toNumber, additionalParams);
    
    // Convert to URLSearchParams for the voice service
    const formData = new URLSearchParams();
    Object.entries(callParams).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    const baseUrl = process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? process.env.VOICE_AGENT_SERVICE_URL : process.env.VOICE_AGENT_SERVICE_URL_DEV;
    console.log('baseUrl', baseUrl)
    console.log('formData', formData.toString())
    const response = await fetch(`${baseUrl}/create-outbound-call`, {
      method: 'POST',
      body: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-KEY': process.env.VOICE_SERVICE_API_KEY!,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Voice service error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating outbound call:', error);
    throw error;
  }
} 