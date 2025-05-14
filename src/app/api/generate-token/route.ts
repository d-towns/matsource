import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    // Get API key from headers
    const apiKeyId = req.headers.get('x-api-key');
    if (!apiKeyId) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }
    const supabase = await createSupabaseSSRClient();
    // Fetch the API key from the database
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('id, key, user_id,team_id')
      .eq('id', apiKeyId)
      .single();

    if (apiKeyError || !apiKeyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { formName, agentId, domains } = body;

    if (!formName || !agentId || !domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: formName, agentId, and domains array' },
        { status: 400 }
      );
    }

    // Verify that the agent exists and belongs to the user
    const { data: agentData, error: agentError } = await supabase
      .from('agents')
      .select('id, type')
      .eq('id', agentId)
      .eq('team_id', apiKeyData.team_id)
      .single();

    if (agentError || !agentData) {
      return NextResponse.json(
        { error: 'Invalid agent ID or agent does not belong to user' },
        { status: 400 }
      );
    }

    // Create the form in the database
    const formId = uuidv4();

    const createFormPayload = {
      id: formId,
      name: formName,
      agent_id: agentId,
      user_id: apiKeyData.user_id,
      team_id: apiKeyData.team_id,
      api_key_id: apiKeyId,
      is_active: true,
      metadata: {},
    }
    console.log(createFormPayload)
    const { error: formError } = await supabase
      .from('forms')
      .insert(createFormPayload);
    if (formError) {
      console.error(formError)
      return NextResponse.json(
        { error: 'Failed to create form' },
        { status: 500 }
      );
    }

    // Store allowed domains
    for (const domain of domains) {
      await supabase.from('form_domains').insert({ form_id: formId, domain });
    }

    // Return the loader.js embed code
    const embedCode = `<script src=\"https://matbot.com/loader.js\" data-form-id=\"${formId}\"></script>`;

    // update the form with the embed code
    const { error: updateError } = await supabase
      .from('forms')
      .update({ embed_code: embedCode })
      .eq('id', formId);
      
    if (updateError) {
      console.error(updateError)
      return NextResponse.json(
        { error: 'Failed to update form' },
        { status: 500 }
      );
    }
    return NextResponse.json({ embedCode });
  } catch (error) {
    console.error('Error generating embed code:', error);
    return NextResponse.json(
      { error: 'Failed to generate embed code' },
      { status: 500 }
    );
  }
} 