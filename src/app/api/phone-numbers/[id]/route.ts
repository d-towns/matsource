import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getVerificationStatus,
} from '@/lib/services/PhoneNumberService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

const DeletePhoneNumberSchema = z.object({
  teamId: z.string().uuid(),
});

// GET /api/phone-numbers/[id] - get a specific phone number
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    const phoneNumber = await getVerificationStatus(id, teamId);
    return NextResponse.json(phoneNumber);
  } catch (err) {
    console.error('Error fetching phone number:', err);
    return NextResponse.json({ error: 'Phone number not found' }, { status: 404 });
  }
}

// DELETE /api/phone-numbers/[id] - delete a phone number
export async function DELETE(
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
    parsed = DeletePhoneNumberSchema.parse(await req.json());
  } catch (err) {
    console.error('Error parsing delete request:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { teamId } = parsed;

  try {
    const adminSupabase = getSupabaseAdminClient();
    const { error } = await adminSupabase
      .from('phone_numbers')
      .delete()
      .eq('id', id)
      .eq('team_id', teamId);

    if (error) {
      console.error('Error deleting phone number:', error);
      throw new Error('Failed to delete phone number');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting phone number:', err);
    return NextResponse.json({ error: 'Failed to delete phone number' }, { status: 500 });
  }
} 