import type { PlanId } from '@/data/pricingPlans';
import { supabase } from '@/lib/supabase';

const CHECKOUT_FUNCTION = 'create-checkout';
const SIMULATED_CHECKOUT_DELAY_MS = 1500;

interface CheckoutRequest {
  bookId: string;
  planId: PlanId;
  email: string;
}

export async function requestCheckoutUrl(request: CheckoutRequest): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.functions.invoke<unknown>(CHECKOUT_FUNCTION, { body: request });
    if (error) return null;
    const url = (data as { url?: unknown } | null)?.url;
    return typeof url === 'string' && url.startsWith('https://') ? url : null;
  } catch {
    return null;
  }
}

export async function isBookUnlocked(bookId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('stories').select('is_unlocked').eq('id', bookId).maybeSingle();
    if (error || !data) return false;
    return data.is_unlocked === true;
  } catch {
    return false;
  }
}

export function waitForSimulatedCheckout(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, SIMULATED_CHECKOUT_DELAY_MS));
}
