import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  retryVerification,
} from '@/lib/services/PhoneNumberService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

const RetryVerificationSchema = z.object({
  teamId: z.string().uuid(),
});

// POST /api/phone-numbers/[id]/retry - retry verification for a phone number
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseSSRClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let parsed;
  try {
    parsed = RetryVerificationSchema.parse(await req.json());
  } catch (err) {
    console.error('Error parsing retry request:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { teamId } = parsed;

  try {
    const result = await retryVerification(id, teamId);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Error retrying verification:', err);
    return NextResponse.json({ error: 'Failed to retry verification' }, { status: 500 });
  }
} 