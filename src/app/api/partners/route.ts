import { NextResponse } from 'next/server';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { getPartnerById } from '@/lib/services/PartnerService';

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
    return NextResponse.json({ partner: null }, { status: 200 });
  }

  const partner = await getPartnerById(userRow.partner_id);
  return NextResponse.json({ partner }, { status: 200 });
} 