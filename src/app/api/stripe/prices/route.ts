import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';

export async function GET() {
  try {
    // Fetch all active prices with expanded product data
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
      limit: 100, // Adjust as needed
    });

    // Filter and transform the prices
    const filteredPrices = prices.data.filter(price => {
      // Only include recurring prices (subscriptions)
      if (price.type !== 'recurring') return false;
      
      // In development, filter out prices with amount lower than $240 (24000 cents)
      if (process.env.NODE_ENV === 'development') {
        return price.unit_amount && price.unit_amount >= 24000; // $240.00 in cents
      }
      
      return true;
    });

    // Transform prices to a more frontend-friendly format
    const transformedPrices = filteredPrices.map(price => {
      const product = price.product as Stripe.Product; // Stripe.Product when expanded
      
      // Log metadata for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`Price ${price.id} metadata:`, price.metadata);
        console.log(`Product ${product.id} metadata:`, product.metadata);
      }
      
      return {
        id: price.id,
        productId: product.id,
        name: product.name,
        description: product.description,
        unitAmount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        trialPeriodDays: price.recurring?.trial_period_days,
        metadata: {
          ...product.metadata,
          ...price.metadata, // Price metadata takes precedence
        },
        // Format price for display
        formattedPrice: price.unit_amount 
          ? `$${(price.unit_amount / 100).toFixed(0)}`
          : 'Custom',
        formattedInterval: price.recurring?.interval === 'month' ? '/month' : 
                          price.recurring?.interval === 'year' ? '/year' : '',
      };
    });

    // Sort by unit_amount (price) ascending
    transformedPrices.sort((a, b) => (a.unitAmount || 0) - (b.unitAmount || 0));

    return NextResponse.json({ 
      prices: transformedPrices,
      count: transformedPrices.length 
    });
  } catch (error) {
    console.error('Error fetching Stripe prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' }, 
      { status: 500 }
    );
  }
} 