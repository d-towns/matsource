
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import redis from '@/lib/redis/client';
import { twilioClient } from '@/lib/twilio/client'
import { headers } from 'next/headers';

const IS_DEV = process.env.NODE_ENV === 'development'
// export const config = { api: { bodyParser: false } };
export async function POST(req: NextRequest) {
    // const sig = req.headers.get("stripe-signature") as string;
    let event: Stripe.Event;
    const headersList = await headers();
    const sig = headersList.get('stripe-signature') ?? '';
    const stripeWebhookSecret : string = process.env.NODE_ENV === 'production' ? process.env.STRIPE_WEBHOOK_SECRET! : process.env.STRIPE_WEBHOOK_SECRET_DEV!

    // 2. Read the body without touching it
    //    ─────────────  pick one  ─────────────
    // Option A – as a UTF-8 string (what Stripe expects)
    const rawBody = await req.text(); 
    // const buf = await req.arrayBuffer(); // raw body for signature/
// console.log(body)
    try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          sig,
          stripeWebhookSecret
        );
    } catch (err) {
      console.error("Stripe signature error:", err);
      return NextResponse.json({ error: "Bad signature" }, { status: 400 });
    }
    console.log('EVENT', event.type)
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted" ||
      event.type === "checkout.session.completed" ||
      event.type === "customer.updated" ||
      event.type === "invoice.paid" ||
      event.type === "invoice.payment_failed"
    ) {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('RUNNING CHECKOUT COMPLETION HANDLER');
        await handleCheckoutCompletion(session);
      } else if (event.type === "customer.updated") {
        const customer = event.data.object as Stripe.Customer;
        console.log('RUNNING CUSTOMER UPDATE HANDLER');
        await handleCustomerUpdate(customer);
      } else if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('RUNNING INVOICE HANDLER');
        await handleInvoiceEvent(invoice, event.type);
      } else {
        const sub = event.data.object as Stripe.Subscription;
        console.log('RUNNING SUBSCRIPTION HANDLER')
        await handleSubscription(sub);
      }
    }
  
    // You can catch invoice.paid etc. here too.
    return NextResponse.json({ received: true });
  }
  
  // ---------------------------------------------------------------------------
  
  async function handleCheckoutCompletion(session: Stripe.Checkout.Session) {
    const supabase = getSupabaseAdminClient();
    const teamId = session.metadata?.team_id;
    
    if (!teamId) {
      console.warn("Checkout session without team_id metadata:", session.id);
      return;
    }

    // Update team onboarding step to team_details
    const { error } = await supabase
      .from("teams")
      .update({ onboarding_step: 'team_details' })
      .eq("id", teamId);

    if (error) {
      console.error('Failed to update team onboarding step:', error);
    } else {
      console.log('Team onboarding step updated to team_details');
    }
  }

  async function handleSubscription(sub: Stripe.Subscription) {
    const supabase = getSupabaseAdminClient();
    const teamId = sub.metadata.team_id; // set in your Checkout Session
    if (!teamId) {
      console.warn("Subscription without team_id metadata:", sub.id);
      return;
    }
  
      /* ── 1. Pull limits from Price metadata ──────────────────────────────── */
  const item = sub.items.data[0];
  // console.log(item)
  const price = await stripe.prices.retrieve(item.price.id, {
    expand: ["product"],
  });

  // console.log('SUBSCRIPTION', sub)
  // console.log('PRICE METADATA', price.metadata)

  // Try to get from price metadata first, then subscription metadata, then defaults
  const pool = parseInt(
    price.metadata?.pool_minutes ?? 
    sub.metadata.pool_minutes ?? 
    "1000", 
    10
  );
  const conc = parseInt(
    price.metadata?.concurrency_max ?? 
    sub.metadata.concurrency_max ?? 
    "5", 
    10
  );
    const tier = price.nickname || (price.product as any)?.name || 'Unknown Plan'
    const days_until_due = sub.days_until_due
    const current_period_end = new Date(sub['current_period_end']).toISOString()
    const current_period_start = new Date(sub['current_period_start']).toISOString()
    /* ── 2. Upsert DB row (team_subscriptions) ──────────────────────────── */
    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
    
    const { data, error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          team_id: teamId,
          stripe_subscription_id: sub.id,
          stripe_customer_id: customerId,
          stripe_item_id: item.id,
          current_period_pool_minutes_usage: 0,
          concurrency_max: conc,
          current_period_start: current_period_start,
          current_period_end: current_period_end,
        },
        { onConflict: "team_id" }
      ).select()

      if(error) {
        console.log('SUBSCRIPTION UPDATE FAILED', error)
      } else if(data) {
        console.log('SUBSCRIPTION UPDATED')
      }
  
    /* ── 3. Seed/refresh Redis plan:{team} hash ─────────────────────────── */
    await redis
      .multi()
      .del(`plan:${teamId}`) // toss old meta (if any)
      .hset(`plan:${teamId}`, {
        tier,
        pool_minutes: pool,
        concurrency_max: conc,
      })
      .expire(`plan:${teamId}`, 60 * 60 * 24) // 24 h
      .exec();
  
    /* ── 4. Twilio sub-account (first time only) ────────────────────────── */
    const { data: existing } = await supabase
      .from("teams")
      .select("twilio_subaccount_sid")
      .eq("id", teamId)
      .maybeSingle();
  
    // if (!existing?.twilio_subaccount_sid) {
    //   const subAcc = await twilioClient.api.accounts.create({
    //     friendlyName: `BlueAgent-${teamId}`,
    //   });
  
    //   await supabase
    //     .from("teams")
    //     .update({ twilio_subaccount_sid: subAcc.sid })
    //     .eq("id", teamId);
    // }
  }

  async function handleCustomerUpdate(customer: Stripe.Customer) {
    const supabase = getSupabaseAdminClient();
    
    try {
      // Update customer information in subscriptions table
      const { error } = await supabase
        .from("subscriptions")
        .update({
          // We could store additional customer metadata here if needed
          metadata: {
            customer_email: customer.email,
            customer_name: customer.name,
            updated_at: new Date().toISOString()
          }
        })
        .eq("stripe_customer_id", customer.id);

      if (error) {
        console.error('Failed to update customer info:', error);
      } else {
        console.log('Customer info updated successfully');
      }
    } catch (error) {
      console.error('Error in handleCustomerUpdate:', error);
    }
  }

  async function handleInvoiceEvent(invoice: Stripe.Invoice, eventType: string) {
    const supabase = getSupabaseAdminClient();
    
    try {
      // Find the subscription associated with this invoice
      const invoiceSubscription = (invoice as any).subscription;
      if (!invoiceSubscription) {
        console.warn('Invoice without subscription:', invoice.id);
        return;
      }

      const subscriptionId = typeof invoiceSubscription === 'string' 
        ? invoiceSubscription 
        : invoiceSubscription.id;

      // Update subscription based on invoice status
      const updateData: any = {};
      
      if (eventType === 'invoice.paid') {
        // Invoice was successfully paid
        updateData.status = 'active';
        console.log('Invoice paid successfully:', invoice.id);
      } else if (eventType === 'invoice.payment_failed') {
        // Invoice payment failed
        updateData.status = 'past_due';
        console.log('Invoice payment failed:', invoice.id);
      }

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("stripe_subscription_id", subscriptionId);

        if (error) {
          console.error('Failed to update subscription from invoice event:', error);
        } else {
          console.log('Subscription updated from invoice event');
        }
      }
    } catch (error) {
      console.error('Error in handleInvoiceEvent:', error);
    }
  }