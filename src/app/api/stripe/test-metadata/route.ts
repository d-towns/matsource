import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

export async function GET(req: NextRequest) {
  try {
    // Get a specific price ID from query params for testing
    const url = new URL(req.url);
    const priceId = url.searchParams.get('priceId');
    
    if (priceId) {
      // Test specific price
      const price = await stripe.prices.retrieve(priceId, {
        expand: ['product']
      });
      
      return NextResponse.json({
        priceId: price.id,
        priceMetadata: price.metadata,
        productMetadata: (price.product as any).metadata,
        combinedMetadata: {
          ...(price.product as any).metadata,
          ...price.metadata, // Price metadata takes precedence
        }
      });
    } else {
      // Test all prices
      const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product'],
        limit: 10,
      });

      const results = prices.data.map(price => ({
        priceId: price.id,
        productName: (price.product as any).name,
        priceMetadata: price.metadata,
        productMetadata: (price.product as any).metadata,
        hasPoolMinutes: !!price.metadata?.pool_minutes,
        hasConcurrencyMax: !!price.metadata?.concurrency_max,
      }));

      return NextResponse.json({
        message: 'Metadata test results',
        results,
        summary: {
          totalPrices: results.length,
          pricesWithPoolMinutes: results.filter(r => r.hasPoolMinutes).length,
          pricesWithConcurrencyMax: results.filter(r => r.hasConcurrencyMax).length,
        }
      });
    }
  } catch (error) {
    console.error('Error testing metadata:', error);
    return NextResponse.json(
      { error: 'Failed to test metadata', details: error.message }, 
      { status: 500 }
    );
  }
} 