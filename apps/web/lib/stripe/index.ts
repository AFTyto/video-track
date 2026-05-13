import Stripe from "stripe";
import { StripeMode } from "../types";

// Create placeholder that will fail at runtime if Stripe is not configured
const createLazyStripe = (): Stripe => {
  if (!process.env.STRIPE_SECRET_KEY) {
    // Return a mock object that will throw when actually used
    return {
      charges: { list: async () => { throw new Error("STRIPE_SECRET_KEY not configured"); } },
      customers: { list: async () => { throw new Error("STRIPE_SECRET_KEY not configured"); } },
      paymentIntents: { list: async () => { throw new Error("STRIPE_SECRET_KEY not configured"); } },
      subscriptions: { list: async () => { throw new Error("STRIPE_SECRET_KEY not configured"); } },
      invoices: { list: async () => { throw new Error("STRIPE_SECRET_KEY not configured"); } },
      transfers: { list: async () => { throw new Error("STRIPE_SECRET_KEY not configured"); } },
      accounts: { del: async () => { throw new Error("STRIPE_SECRET_KEY not configured"); } },
      balanceTransactions: { list: async () => { throw new Error("STRIPE_SECRET_KEY not configured"); } },
      sourceTransactions: { list: async () => { throw new Error("STRIPE_SECRET_KEY not configured"); } },
      methods: { list: async () => { throw new Error("STRIPE_SECRET_KEY not configured"); } },
    } as unknown as Stripe;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
    appInfo: {
      name: "Dub.co",
      version: "0.1.0",
    },
  });
};

// Use lazy initialization pattern to avoid build-time errors
let _stripe: Stripe | null = null;

const getStripe = (): Stripe => {
  if (!_stripe) {
    _stripe = createLazyStripe();
  }
  return _stripe;
};

export const stripe = {
  get charges() { return getStripe().charges; },
  get customers() { return getStripe().customers; },
  get paymentIntents() { return getStripe().paymentIntents; },
  get subscriptions() { return getStripe().subscriptions; },
  get invoices() { return getStripe().invoices; },
  get transfers() { return getStripe().transfers; },
  get accounts() { return getStripe().accounts; },
  get balanceTransactions() { return getStripe().balanceTransactions; },
  get sourceTransactions() { return getStripe().sourceTransactions; },
  get methods() { return getStripe().methods; },
};

const secretMap: Record<StripeMode, string | undefined> = {
  live: process.env.STRIPE_APP_SECRET_KEY,
  test: process.env.STRIPE_APP_SECRET_KEY_TEST,
  sandbox: process.env.STRIPE_APP_SECRET_KEY_SANDBOX,
};

// Stripe Integration App client
export const stripeAppClient = ({ mode }: { mode?: StripeMode }) => {
  const appSecretKey = secretMap[mode ?? "live"];

  return new Stripe(appSecretKey!, {
    apiVersion: "2025-05-28.basil",
    appInfo: {
      name: "Dub.co",
      version: "0.1.0",
    },
  });
};
