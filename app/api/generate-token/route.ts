import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for API calls to widget service
const widgetServiceUrl = process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEV_WIDGET_SERVICE_URL! : process.env.WIDGET_SERVICE_URL || 'http://localhost:3002';


const supabaseUrl = process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEV_SUPABASE_URL! : process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEV_SUPABASE_SERVICE_ROLE_KEY! : process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Fetch the API key from the database
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('id, key, user_id')
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
      .eq('user_id', apiKeyData.user_id)
      .single();

    if (agentError || !agentData) {
      return NextResponse.json(
        { error: 'Invalid agent ID or agent does not belong to user' },
        { status: 400 }
      );
    }

    console.log(`${widgetServiceUrl}/api/generate-token`)
    console.log(
      {
        userId: apiKeyData.user_id,
        agentId: agentId,
        domains: domains,
        formName: formName
      }
    )
    // Call the widget service to generate a token
    const generateTokenUrl = `${widgetServiceUrl}/api/generate-token`;
    console.log('generateTokenUrl', generateTokenUrl);
    const response = await fetch(`${widgetServiceUrl}/api/generate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKeyData.key
      },
      body: JSON.stringify({
        userId: apiKeyData.user_id,
        agentId: agentId,
        domains: domains,
        formName: formName
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to generate token' },
        { status: response.status }
      );
    }

    // Return the token data
    const tokenData = await response.json();
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
} 