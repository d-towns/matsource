import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { startCallerIdVerification } from '@/lib/services/PhoneNumberService';

// Schema for starting caller ID verification
const StartCallerIdSchema = z.object({
  teamId: z.string().uuid(),
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format'),
  friendlyName: z.string().min(1, 'Friendly name is required'),
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
    const { teamId, phoneNumber, friendlyName } = StartCallerIdSchema.parse(body);
    console.log('user', user);
    // Verify user has access to the team
    const { data: userTeam, error: teamError } = await supabase.rpc('get_user_teams')
    console.log('userTeam', userTeam);

    if (teamError || !userTeam) {
      return NextResponse.json({ error: 'Access denied to team' }, { status: 403 });
    }

    // Check if phone number is already verified for this team
    const { data: existingPhone } = await supabase
      .from('phone_numbers')
      .select('id, verification_status')
      .eq('team_id', teamId)
      .eq('phone_number', phoneNumber)
      .eq('verification_status', 'success')
      .single();

    if (existingPhone) {
      return NextResponse.json({ 
        error: 'Phone number is already verified for this team' 
      }, { status: 400 });
    }

    // Start verification process
    const result = await startCallerIdVerification({
      teamId,
      phoneNumber,
      friendlyName,
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error starting caller ID verification:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to start caller ID verification' 
    }, { status: 500 });
  }
} 