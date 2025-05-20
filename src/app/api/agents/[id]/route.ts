import { NextRequest, NextResponse } from 'next/server';
import { AgentService } from '@/lib/services/AgentService';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const teamId = request.nextUrl.searchParams.get('teamId');
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 });
  }
  const { id } = await params;
  try {
    const agent = await AgentService.getAgentById(id, teamId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    return NextResponse.json(agent);
  } catch (error) {
    if (error?.message?.includes('No rows')) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    console.error('Error fetching agent:', error);
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }
}
