import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { ensureTeamHasSubaccount, purchasePhoneNumberForSubaccount } from '@/lib/services/TwilioSubaccountService';
import { createTwilioPhoneNumber, setDefaultPhoneNumber } from '@/lib/services/PhoneNumberService';

// Schema for phone choice request
const PhoneChoiceSchema = z.object({
  choice: z.enum(['existing', 'new']),
  teamId: z.string().uuid(),
  areaCode: z.string().optional(), // Optional area code preference for new numbers
});

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createSupabaseSSRClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    console.log('body', body);
    const { choice, teamId, areaCode } = PhoneChoiceSchema.parse(body);

    // Verify user has access to the team
    const { data: userTeam, error: teamError } = await supabase.rpc('get_user_teams')
    console.log('userTeam', userTeam);
    if (teamError || !userTeam) {
      return NextResponse.json({ error: 'Access denied to team' }, { status: 403 });
    }

    if (choice === 'existing') {
      // User wants to verify their own number - just return success
      // The caller ID verification flow will handle the rest
      return NextResponse.json({ 
        success: true, 
        choice: 'existing',
        message: 'Proceed with caller ID verification'
      });
    }

    if (choice === 'new') {
      // User wants a new Twilio number - create subaccount and purchase number
      
      // Get team details
      const { data: team, error: teamFetchError } = await supabase
        .from('teams')
        .select('name')
        .eq('id', teamId)
        .single();

      if (teamFetchError || !team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }

      try {
        // Ensure team has a subaccount
        const subaccountResult = await ensureTeamHasSubaccount(teamId, team.name);
        
        // Purchase a phone number for the subaccount
        const phoneNumberResult = await purchasePhoneNumberForSubaccount(
          subaccountResult.subaccountSid,
          subaccountResult.authToken,
          areaCode
        );

        // Store the phone number in our database
        const phoneNumberRecord = await createTwilioPhoneNumber({
          teamId,
          phoneNumber: phoneNumberResult.phoneNumber,
          twilioPhoneNumberSid: phoneNumberResult.phoneNumberSid,
          twilioSubaccountSid: subaccountResult.subaccountSid,
          friendlyName: phoneNumberResult.friendlyName,
        });

        // Set this as the team's default phone number
        await setDefaultPhoneNumber(teamId, phoneNumberRecord.id);

        return NextResponse.json({
          success: true,
          choice: 'new',
          phoneNumber: {
            id: phoneNumberRecord.id,
            phoneNumber: phoneNumberResult.phoneNumber,
            friendlyName: phoneNumberResult.friendlyName,
            type: 'twilio_purchased',
          },
          message: 'Phone number purchased successfully'
        });

      } catch (error) {
        console.error('Error purchasing phone number:', error);
        return NextResponse.json({ 
          error: 'Failed to purchase phone number. Please try again or contact support.' 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid choice' }, { status: 400 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: error.errors 
      }, { status: 400 });
    }

    console.error('Error processing phone choice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 