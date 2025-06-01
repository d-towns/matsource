import { Twilio } from 'twilio';
import { config } from '@/lib/config';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

// Main Twilio client using master account credentials
const twilioClient = new Twilio(config.services.twilio.accountSid, config.services.twilio.authToken);

export interface SubaccountCreationResult {
  subaccountSid: string;
  authToken: string;
  friendlyName: string;
}

export interface PhoneNumberPurchaseResult {
  phoneNumber: string;
  phoneNumberSid: string;
  friendlyName: string;
}

/**
 * Create a Twilio subaccount for a team
 */
export async function createSubaccountForTeam(
  teamId: string, 
  teamName: string
): Promise<SubaccountCreationResult> {
  try {
    // Create the subaccount
    const subAccount = await twilioClient.api.accounts.create({
      friendlyName: `${teamName} - ${teamId.slice(0, 8)}`,
    });

    // Store subaccount details in the teams table
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('teams')
      .update({
        twilio_subaccount_sid: subAccount.sid,
        twilio_subaccount_auth_token: subAccount.authToken,
      })
      .eq('id', teamId);

    if (error) {
      console.error('Error storing subaccount details:', error);
      throw new Error('Failed to store subaccount details in database');
    }

    console.log(`Created subaccount ${subAccount.sid} for team ${teamId}`);

    return {
      subaccountSid: subAccount.sid,
      authToken: subAccount.authToken,
      friendlyName: subAccount.friendlyName,
    };
  } catch (error) {
    console.error('Error creating Twilio subaccount:', error);
    throw new Error('Failed to create Twilio subaccount');
  }
}

/**
 * Purchase a phone number for a subaccount
 */
export async function purchasePhoneNumberForSubaccount(
  subaccountSid: string,
  authToken: string,
  areaCode?: string,
  country: string = 'US'
): Promise<PhoneNumberPurchaseResult> {
  try {
    // Create Twilio client for the subaccount
    const subClient = new Twilio(subaccountSid, authToken);

    // Search for available phone numbers
    const searchParams: { limit: number; areaCode?: number } = { limit: 20 };
    if (areaCode) {
      searchParams.areaCode = parseInt(areaCode, 10);
    }

    const availableNumbers = await subClient.availablePhoneNumbers(country)
      .local.list(searchParams);

    if (availableNumbers.length === 0) {
      throw new Error(`No phone numbers available${areaCode ? ` in area code ${areaCode}` : ''}`);
    }

    // Purchase the first available number
    const selectedNumber = availableNumbers[0];
    const purchasedNumber = await subClient.incomingPhoneNumbers.create({
      phoneNumber: selectedNumber.phoneNumber,
      friendlyName: 'Business Phone Number',
      voiceMethod: 'POST',
      voiceUrl: `${config.services.voice.serviceUrl}/create-inbound-call`,
      statusCallback: `${config.services.voice.serviceUrl}/call-status`,
      statusCallbackMethod: 'POST',
    });

    console.log(`Purchased phone number ${purchasedNumber.phoneNumber} for subaccount ${subaccountSid}`);

    return {
      phoneNumber: purchasedNumber.phoneNumber,
      phoneNumberSid: purchasedNumber.sid,
      friendlyName: purchasedNumber.friendlyName || 'Business Phone Number',
    };
  } catch (error) {
    console.error('Error purchasing phone number:', error);
    throw new Error('Failed to purchase phone number');
  }
}

/**
 * Get a Twilio client for a specific subaccount
 */
export function getSubaccountClient(subaccountSid: string, authToken: string): Twilio {
  return new Twilio(subaccountSid, authToken);
}

/**
 * Check if a team has a subaccount, create one if not
 */
export async function ensureTeamHasSubaccount(teamId: string, teamName: string): Promise<SubaccountCreationResult> {
  const supabase = getSupabaseAdminClient();
  
  // Check if team already has a subaccount
  const { data, error } = await supabase
    .from('teams')
    .select('twilio_subaccount_sid, twilio_subaccount_auth_token')
    .eq('id', teamId)

  if (error) {
    console.error('Error fetching team details:', error);
    throw new Error('Failed to fetch team details');
  }

  const team = data[0];


  // If subaccount already exists, return existing details
  if (team && team.twilio_subaccount_sid && team.twilio_subaccount_auth_token) {
    return {
      subaccountSid: team.twilio_subaccount_sid,
      authToken: team.twilio_subaccount_auth_token,
      friendlyName: `${teamName} - ${teamId.slice(0, 8)}`,
    };
  }

  // Create new subaccount
  return await createSubaccountForTeam(teamId, teamName);
}

/**
 * Release/close a subaccount (for cleanup when team is deleted)
 */
export async function closeSubaccount(subaccountSid: string): Promise<void> {
  try {
    await twilioClient.api.accounts(subaccountSid).update({
      status: 'closed'
    });
    console.log(`Closed subaccount ${subaccountSid}`);
  } catch (error) {
    console.error('Error closing subaccount:', error);
    // Don't throw here - this is cleanup, we don't want to block other operations
  }
} 