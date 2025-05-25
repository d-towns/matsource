import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getPhoneNumbers,
  startCallerIdVerification,
} from '@/lib/services/PhoneNumberService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

const CreatePhoneNumberSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
  friendlyName: z.string().min(1, 'Friendly name is required'),
  teamId: z.string().uuid(),
});

// GET /api/phone-numbers - list all phone numbers for the team
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get('teamId');
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }

  try {
    const phoneNumbers = await getPhoneNumbers(teamId);
    return NextResponse.json(phoneNumbers);
  } catch (err) {
    console.error('Error fetching phone numbers:', err);
    return NextResponse.json({ error: 'Failed to fetch phone numbers' }, { status: 500 });
  }
}

// POST /api/phone-numbers - create a new phone number verification
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let parsed;
  try {
    parsed = CreatePhoneNumberSchema.parse(await req.json());
  } catch (err) {
    console.error('Error parsing phone number request:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { teamId, phoneNumber, friendlyName } = parsed;

  try {
    const result = await startCallerIdVerification({
      teamId,
      phoneNumber,
      friendlyName,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    console.error('Error creating phone number verification:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to start phone number verification' }, { status: 500 });
  }
} 