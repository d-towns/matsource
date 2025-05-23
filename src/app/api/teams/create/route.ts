import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

export async function POST() {
  try {
    const supabase = await createSupabaseSSRClient();
    const adminSupabase = getSupabaseAdminClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has a team via user_teams table
    const { data: existingUserTeam } = await adminSupabase
      .from('user_teams')
      .select('team_id')
      .eq('user_id', user.id)
      .single();

    if (existingUserTeam?.team_id) {
      return NextResponse.json({ error: 'User already has a team' }, { status: 400 });
    }

    // Create new team
    const { data: team, error: teamError } = await adminSupabase
      .from('teams')
      .insert({
        name: `${user.email?.split('@')[0]}'s Team`,
        description: 'New team',
        onboarding_step: 'plan_selection'
      })
      .select()
      .single();

    if (teamError) {
      console.error('Team creation error:', teamError);
      return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
    }

    // Create user_teams record to associate user with team
    const { error: userTeamError } = await adminSupabase
      .from('user_teams')
      .insert({
        user_id: user.id,
        team_id: team.id,
        role: 'owner'
      });

    if (userTeamError) {
      console.error('User team assignment error:', userTeamError);
      return NextResponse.json({ error: 'Failed to assign team to user' }, { status: 500 });
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Team creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 