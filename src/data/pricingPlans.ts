import { Crown, Sparkles, Wand2, type LucideIcon } from 'lucide-react';

export type PlanId = 'starter' | 'pro' | 'creator';

export interface PricingPlan {
  id: PlanId;
  name: string;
  subtitle: string;
  amountCents: number;
  period: string;
  features: string[];
  icon: LucideIcon;
  tileClass: string;
  badge?: { text: string; className: string };
  highlightStroke?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Spark',
    subtitle: 'Perfect to try the magic',
    amountCents: 699,
    period: 'one-time',
    features: ['1 High-Quality Custom Story', 'Standard Art Generation', 'Digital Flipbook Access', 'Standard PDF Download'],
    icon: Sparkles,
    tileClass: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'pro',
    name: 'Pro Parent Plan',
    subtitle: 'Daily Bedtime Stories for Parents & Teachers',
    amountCents: 999,
    period: '/month',
    features: [
      '35 AI Stories per Month (Daily 1 + 5 Bonus)',
      'High-Definition (HD) Premium Images',
      'Print-Ready PDF Downloads',
      'No Watermarks (Clean Branding)',
    ],
    icon: Wand2,
    tileClass: 'bg-amber-100 text-amber-700',
    badge: { text: 'BEST SELLER', className: 'bg-gradient-to-r from-amber-400 to-rose-400 text-white' },
  },
  {
    id: 'creator',
    name: 'Creator / Business Plan',
    subtitle: 'For Amazon KDP, Kindle & Etsy Publishers',
    amountCents: 3999,
    period: '/month',
    features: [
      'UNLIMITED AI Stories & Ultra-HD Images',
      'Full Commercial License (100% Sell Rights)',
      'Bulk PDF Book Export (50-100 pages)',
      'Lightning-Fast Priority Generation Speed',
    ],
    icon: Crown,
    tileClass: 'bg-rose-100 text-rose-700',
    badge: { text: 'PREMIUM', className: 'bg-blue-600 text-white' },
    highlightStroke: 'border-blue-500',
  },
];

export function getPlanName(planId: string): string | null {
  return PRICING_PLANS.find((plan) => plan.id === planId)?.name ?? null;
}

export function formatUsd(amountCents: number): string {
  return `$${(amountCents / 100).toFixed(2)}`;
}
