import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

export const STRIPE_PRICE_IDS = {
  pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO!,
  premium: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM!,
} as const;

export type StripePriceId = keyof typeof STRIPE_PRICE_IDS;
