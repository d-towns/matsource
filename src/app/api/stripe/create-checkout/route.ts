import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : process.env.NEXT_PUBLIC_DEV_BASE_URL;
export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();
    console.log('priceId', priceId);
    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    const supabase = await createSupabaseSSRClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('user', user);
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
      console.log('userError', userError);
      return NextResponse.json({ error: 'User team not found' }, { status: 400 });
    }

    console.log('userTeamData', userTeamData);
    // Get price details to extract metadata
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product']
    });
    console.log('price', price);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/onboarding?step=team_details&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/onboarding?step=plan_selection`,
      customer_email: user.email,
      metadata: {
        team_id: userTeamData.team_id,
      },
      subscription_data: {
        metadata: {
          team_id: userTeamData.team_id,
          pool_minutes: price.metadata?.pool_minutes || '1000',
          concurrency_max: price.metadata?.concurrency_max || '5',
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 