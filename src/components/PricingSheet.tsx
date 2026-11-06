import { useEffect, useState } from 'react';
import { ArrowLeft, Lock, X } from 'lucide-react';
import CheckoutAwaiting from '@/components/CheckoutAwaiting';
import CheckoutForm from '@/components/CheckoutForm';
import CheckoutSuccess from '@/components/CheckoutSuccess';
import PricingCard from '@/components/PricingCard';
import { PRICING_PLANS, type PlanId, type PricingPlan } from '@/data/pricingPlans';
import { isBookUnlocked, requestCheckoutUrl, waitForSimulatedCheckout } from '@/lib/checkout';

interface PricingSheetProps {
  bookId: string;
  defaultEmail: string;
  onClose: () => void;
  onPaid: (plan: PricingPlan, email: string) => void;
}

type SheetView = { step: 'plans' } | { step: 'checkout'; plan: PricingPlan };
type PaymentStatus = 'form' | 'verifying' | 'awaiting' | 'success';

const UNLOCK_POLL_INTERVAL_MS = 2000;

export default function PricingSheet({ bookId, defaultEmail, onClose, onPaid }: PricingSheetProps) {
  const [view, setView] = useState<SheetView>({ step: 'plans' });
  const [selectedId, setSelectedId] = useState<PlanId>('pro');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('form');
  const [paidEmail, setPaidEmail] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const selectedPlan = PRICING_PLANS.find((plan) => plan.id === selectedId);
  const isVerifying = paymentStatus === 'verifying';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isVerifying) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVerifying, onClose]);

  useEffect(() => {
    if (paymentStatus !== 'awaiting') return;
    let isCancelled = false;
    const checkUnlock = async () => {
      const unlocked = await isBookUnlocked(bookId);
      if (!isCancelled && unlocked) setPaymentStatus('success');
    };
    void checkUnlock();
    const interval = window.setInterval(() => void checkUnlock(), UNLOCK_POLL_INTERVAL_MS);
    return () => {
      isCancelled = true;
      window.clearInterval(interval);
    };
  }, [paymentStatus, bookId]);

  const openCheckout = () => {
    if (!selectedPlan) return;
    setPaymentStatus('form');
    setCheckoutUrl(null);
    setView({ step: 'checkout', plan: selectedPlan });
  };

  const backToPlans = () => setView({ step: 'plans' });

  const openCheckoutPage = (url: string) => {
    window.open(url, '_blank', 'noopener');
  };

  const handlePay = async (plan: PricingPlan, email: string) => {
    setPaidEmail(email);
    setPaymentStatus('verifying');
    const url = await requestCheckoutUrl({ bookId, planId: plan.id, email });
    if (url) {
      setCheckoutUrl(url);
      openCheckoutPage(url);
      setPaymentStatus('awaiting');
      return;
    }
    await waitForSimulatedCheckout();
    setPaymentStatus('success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 backdrop-blur-sm animate-fade-in"
      onClick={isVerifying ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-sheet-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-md animate-slide-up-sheet flex-col overflow-y-auto rounded-t-[2rem] bg-cream shadow-2xl"
      >
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-12 rounded-full bg-ink-200" />
        </div>

        {view.step === 'plans' ? (
          <>
            <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-4">
              <div>
                <h2 id="pricing-sheet-title" className="font-display text-2xl font-semibold leading-[1.2] text-ink-900">
                  Unlock Your Storybooks
                </h2>
                <p className="mt-1 text-sm leading-[1.5] text-ink-500">Choose the plan that fits your family.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close pricing"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition hover:bg-ink-200 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div role="radiogroup" aria-label="Subscription plans" className="space-y-5 px-6 pb-4 pt-6">
              {PRICING_PLANS.map((plan) => (
                <PricingCard key={plan.id} plan={plan} isSelected={plan.id === selectedId} onSelect={setSelectedId} />
              ))}
            </div>

            <footer className="border-t border-ink-100 bg-white px-6 pb-8 pt-4">
              <button
                type="button"
                disabled={!selectedPlan}
                onClick={openCheckout}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 py-4 text-base font-bold text-white shadow-lg shadow-brand-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:translate-y-0 disabled:bg-none disabled:bg-ink-200 disabled:text-ink-600 disabled:shadow-none"
              >
                {selectedPlan ? `Subscribe to ${selectedPlan.name} Now` : 'Choose a plan'}
              </button>
              <p className="mt-3 text-center text-xs text-ink-500">Secure checkout. Cancel anytime.</p>
            </footer>
          </>
        ) : paymentStatus === 'success' ? (
          <CheckoutSuccess email={paidEmail} onDone={() => onPaid(view.plan, paidEmail)} />
        ) : (
          <>
            <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={backToPlans}
                  disabled={isVerifying}
                  aria-label="Back to plans"
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink-700 ring-1 ring-ink-100 transition hover:bg-ink-50 active:scale-95 disabled:opacity-40"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
                    <Lock className="h-3.5 w-3.5" />
                    Secure checkout
                  </p>
                  <h2 id="pricing-sheet-title" className="mt-1 font-display text-2xl font-semibold leading-[1.2] text-ink-900">
                    {view.plan.name}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isVerifying}
                aria-label="Close checkout"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition hover:bg-ink-200 active:scale-95 disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {paymentStatus === 'awaiting' && checkoutUrl ? (
              <CheckoutAwaiting email={paidEmail} onReopen={() => openCheckoutPage(checkoutUrl)} />
            ) : (
              <CheckoutForm
                plan={view.plan}
                defaultEmail={defaultEmail}
                isVerifying={isVerifying}
                onSubmit={(email) => void handlePay(view.plan, email)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
