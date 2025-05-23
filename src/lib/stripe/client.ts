import Stripe from 'stripe';
import { config } from '@/lib/config';

export const stripe = new Stripe(config.payments.stripe.secretKey, {
    apiVersion: '2025-04-30.basil',
  });
  