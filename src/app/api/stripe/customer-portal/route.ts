import { NextResponse, NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { Partner } from '@/lib/models/partner';
import { getPartnerByDomain } from '@/lib/services/PartnerService';
import config from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseSSRClient();

    let partner: Partner | null = null;
    let BASE_URL;
    const partnerHost = req.headers.get('X-Host-Domain');
    if(partnerHost) {
      partner = await getPartnerByDomain(partnerHost);
      if(partner) {
        BASE_URL = partner.white_label_origin;
      }
    } else {
      BASE_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : process.env.NEXT_PUBLIC_DEV_BASE_URL;
    }

    const isWhiteLabel = config.env.isWhiteLabel;
    
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
      ...(isWhiteLabel && { stripeAccount: partner?.stripe_account_id })
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