import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe() {
  if (_stripe) return _stripe;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  _stripe = new Stripe(secretKey, {
    apiVersion: '2026-04-22.dahlia',
  });
  return _stripe;
}

export const STRIPE_PRICES = {
  individual: process.env.STRIPE_PRICE_INDIVIDUAL || 'price_individual',
  agency: process.env.STRIPE_PRICE_AGENCY || 'price_agency',
};
