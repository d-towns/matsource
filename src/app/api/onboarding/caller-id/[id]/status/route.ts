import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { getVerificationStatus } from '@/lib/services/PhoneNumberService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const supabase = await createSupabaseSSRClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get team ID from query params
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');
    
    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
    }

    // Verify user has access to the team
    const { data: userTeam, error: teamError } = await supabase
      .from('user_teams')
      .select('team_id')
      .eq('user_id', user.id)
      .eq('team_id', teamId)
      .single();

    if (teamError || !userTeam) {
      return NextResponse.json({ error: 'Access denied to team' }, { status: 403 });
    }

    // Get verification status
    const id = (await params).id;
    const result = await getVerificationStatus(id, teamId);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error getting verification status:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      error: 'Failed to get verification status' 
    }, { status: 500 });
  }
} 