import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

export async function PATCH(req: NextRequest) {
  try {
    const { name, industry, onboarding_step, timezone } = await req.json();
    
    const supabase = await createSupabaseSSRClient();
    const adminSupabase = getSupabaseAdminClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's team via user_teams table
    const { data: userTeamData, error: userError } = await supabase
      .from('user_teams')
      .select('team_id')
      .eq('user_id', user.id)
      .single();

    if (userError || !userTeamData?.team_id) {
      return NextResponse.json({ error: 'User team not found' }, { status: 400 });
    }

    // Prepare update data
    const updateData: Record<string, string> = {};
    
    if (name) updateData.name = name;
    if (onboarding_step) updateData.onboarding_step = onboarding_step;
    if (timezone) updateData.timezone = timezone;
    if(industry) updateData.industry = industry;
    // Update team
    const { data: team, error: updateError } = await adminSupabase
      .from('teams')
      .update(updateData)
      .eq('id', userTeamData.team_id)
      .select()
      .single();

    if (updateError) {
      console.error('Team update error:', updateError);
      return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Team update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 