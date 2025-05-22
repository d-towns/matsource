import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

export async function GET(req: NextRequest) {
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
          subscriptions(
            id,
            stripe_customer_id,
            stripe_subscription_id,
            status,
            current_period_start,
            current_period_end,
            cancel_at_period_end,
            canceled_at,
            trial_start,
            trial_end,
            price_id,
            quantity,
            concurrency_max,
            current_period_pool_minutes_usage
          )
        )
      `)
      .eq('user_id', user.id)
      .single();

    console.log('userTeamData', userTeamData)
    console.log('userError', userError)

    if (userError || !userTeamData?.team_id) {
      return NextResponse.json({ error: 'User team not found' }, { status: 400 });
    }

    const team = userTeamData.teams as any;
    const subscription = team?.subscriptions
    console.log('subscription', subscription)
    if (!subscription) {
      return NextResponse.json({ 
        team_name: team.name,
        has_subscription: false,
        message: 'No active subscription found'
      });
    }

    // Get price information from Stripe
    let priceInfo = null;
    if (subscription.stripe_subscription_id) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id, {
          expand: ['items.data.price.product']
        });
        console.log('stripeSubscription', stripeSubscription)
        const price = stripeSubscription.items.data[0].price;
        console.log('price', price)
        priceInfo = {
          amount: price.unit_amount,
          currency: price.currency,
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
          product_name: (price.product as any)?.name,
          product_description: (price.product as any)?.description,
        };
      } catch (error) {
        console.error('Error fetching price info:', error);
      }
    }

    // Get customer information from Stripe if available
    let customerInfo = null;
    if (subscription.stripe_customer_id) {
      try {
        const customer = await stripe.customers.retrieve(subscription.stripe_customer_id);
        if (customer && !customer.deleted) {
          const customerData = customer as Stripe.Customer;
          customerInfo = {
            email: customerData.email,
            name: customerData.name,
            default_payment_method: customerData.invoice_settings?.default_payment_method,
          };
        }
      } catch (error) {
        console.error('Error fetching customer info:', error);
      }
    }

    return NextResponse.json({
      team_name: team.name,
      has_subscription: true,
      user_role: userTeamData.role,
      can_manage_billing: ['owner', 'admin'].includes(userTeamData.role),
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at,
        trial_start: subscription.trial_start,
        trial_end: subscription.trial_end,
        quantity: subscription.quantity,
        concurrency_max: subscription.concurrency_max,
        current_period_pool_minutes_usage: subscription.current_period_pool_minutes_usage,
      },
      price: priceInfo,
      customer: customerInfo,
    });

  } catch (error) {
    console.error('Billing info fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 