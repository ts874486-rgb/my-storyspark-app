import { Check } from 'lucide-react';
import { formatUsd, type PricingPlan, type PlanId } from '@/data/pricingPlans';

interface PricingCardProps {
  plan: PricingPlan;
  isSelected: boolean;
  onSelect: (id: PlanId) => void;
}

export default function PricingCard({ plan, isSelected, onSelect }: PricingCardProps) {
  const Icon = plan.icon;
  const highlight = plan.highlightStroke ?? (isSelected ? 'border-brand-400' : 'border-ink-100');
  const selectedRing = plan.highlightStroke ? 'ring-blue-200' : 'ring-brand-100';
  const selectedBg = plan.highlightStroke ? 'bg-blue-50/40' : 'bg-brand-50/40';

  return (
    <div className="relative">
      {plan.badge && (
        <span
          className={`absolute -top-3 right-5 z-10 animate-float rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-md ${plan.badge.className}`}
        >
          {plan.badge.text}
        </span>
      )}
      <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        onClick={() => onSelect(plan.id)}
        className={`w-full rounded-3xl border-2 bg-white p-5 text-left transition duration-200 active:scale-[0.99] ${
          isSelected
            ? `${highlight} ${selectedBg} shadow-lg ring-4 ${selectedRing}`
            : 'border-ink-100 shadow-sm hover:border-ink-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${plan.tileClass}`}>
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-semibold leading-[1.2] text-ink-900">{plan.name}</p>
            <p className="mt-1 text-sm text-ink-500">{plan.subtitle}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-2xl font-semibold leading-[1.2] text-ink-900">
              {formatUsd(plan.amountCents)}
            </p>
            <p className="mt-1 text-xs text-ink-500">{plan.period}</p>
          </div>
        </div>

        <ul className="mt-4 space-y-2 border-t border-ink-100 pt-4">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm leading-[1.5] text-ink-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={3} />
              {feature}
            </li>
          ))}
        </ul>
      </button>
    </div>
  );
}
