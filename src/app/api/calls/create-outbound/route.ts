import { NextResponse } from 'next/server';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { createOutboundCall } from '@/lib/services/CallService';
import { PhoneNumber } from '@/lib/models/phone_number';

export async function POST(request: Request) {
  const supabase = await createSupabaseSSRClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let reqData;
  try {
    reqData = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { agent_id, to_number, lead_id } = reqData;

  if (!agent_id || !to_number) {
    return NextResponse.json({ error: 'Missing agent_id or to_number' }, { status: 400 });
  }

  if (typeof agent_id !== 'string' || typeof to_number !== 'string') {
    return NextResponse.json({ error: 'Invalid agent_id or to_number format' }, { status: 400 });
  }

  try {
    // 1. Fetch the agent to get phone_number_id and team_id
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('phone_number(*), team_id, type, name')
      .eq('id', agent_id)
      .single();

    if (agentError || !agent) {
      console.error('Error fetching agent:', agentError);
      return NextResponse.json({ error: 'Agent not found or error fetching agent' }, { status: 404 });
    }

    if (agent.type !== 'outbound_voice') {
        return NextResponse.json({ error: 'Invalid agent type. Only outbound_voice agents can make outbound calls.' }, { status: 400 });
    }

    if (!agent.phone_number) {
      return NextResponse.json({ error: 'Agent does not have an associated phone number' }, { status: 400 });
    }
    if (!agent.team_id) {
        return NextResponse.json({ error: 'Agent is not associated with a team' }, { status: 400 });
    }

    // 2. Fetch the phone number details
    const phoneNumber = agent.phone_number as PhoneNumber;
        // 3. Call the createOutboundCall service function
    const callResponse = await createOutboundCall(phoneNumber, agent.team_id, to_number, {
      lead_id,
      agent_id,
    });

    return NextResponse.json(callResponse);

  } catch (error: unknown) {
    console.error('Error creating outbound call:', error);
    // Check if the error has a message property
    const errorMessage = (error as Error).message || 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 