import Stripe from 'stripe';

export const stripe = new Stripe(process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_KEY! : process.env.STRIPE_DEV_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
  });
  