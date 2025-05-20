import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { getTeamsForPartner, createTeamForPartner } from '@/lib/services/PartnerService';

export async function GET() {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Fetch the user's row to get partner_id
  const { data: userRow, error } = await supabase
    .from('users')
    .select('partner_id')
    .eq('id', user.id)
    .single();

  if (error || !userRow?.partner_id) {
    return NextResponse.json({ teams: [] }, { status: 200 });
  }

  const teams = await getTeamsForPartner(userRow.partner_id);
  return NextResponse.json({ teams }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Fetch the user's row to get partner_id
  const { data: userRow, error } = await supabase
    .from('users')
    .select('partner_id')
    .eq('id', user.id)
    .single();

  if (error || !userRow?.partner_id) {
    return NextResponse.json({ error: 'Only partners can create teams.' }, { status: 403 });
  }

  const body = await request.json();
  try {
    const team = await createTeamForPartner(userRow.partner_id, body, user.id);
    return NextResponse.json({ team }, { status: 201 });
  } catch (err) {
    console.error('Error creating team:', err);
    return NextResponse.json({ error: 'Failed to create team.' }, { status: 500 });
  }
} 