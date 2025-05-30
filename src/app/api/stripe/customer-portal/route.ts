import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : process.env.NEXT_PUBLIC_DEV_BASE_URL;
export async function POST() {
  try {
    const supabase = await createSupabaseSSRClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's team and subscription info via user_teams table
    const { data: userTeamData, error: userError } = await supabase
      .from('user_teams')
      .select(`
        team_id,
        role,
        teams!inner(
          name,
          subscriptions!inner(
            stripe_customer_id,
            stripe_subscription_id,
            status
          )
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (userError || !userTeamData?.team_id) {
      return NextResponse.json({ error: 'User team not found' }, { status: 400 });
    }

    // Check if user has permission to manage billing (owner or admin)
    if (!['owner', 'admin'].includes(userTeamData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions to manage billing' }, { status: 403 });
    }

    const subscription = (userTeamData.teams as unknown as { subscriptions?: { stripe_customer_id?: string; status?: string } })?.subscriptions;
    
    if (!subscription?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing information found for this team' }, { status: 400 });
    }

    // Create the customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${BASE_URL}/workspaces/settings/billing`,
    });

    return NextResponse.json({ 
      url: session.url,
      customer_id: subscription.stripe_customer_id,
      subscription_status: subscription.status 
    });

  } catch (error) {
    console.error('Customer portal session creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 