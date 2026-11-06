import { useState, type FormEvent, type ReactNode } from 'react';
import { Apple, Loader2, Sparkles } from 'lucide-react';
import { formatUsd, type PricingPlan } from '@/data/pricingPlans';

interface CheckoutFormProps {
  plan: PricingPlan;
  defaultEmail: string;
  isVerifying: boolean;
  onSubmit: (email: string) => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EXPIRY_PATTERN = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CVC_PATTERN = /^\d{3}$/;
const INPUT_CLASS =
  'w-full bg-transparent text-base text-ink-900 placeholder:text-ink-300 focus:outline-none disabled:opacity-60';

export default function CheckoutForm({ plan, defaultEmail, isVerifying, onSubmit }: CheckoutFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_PATTERN.test(trimmedEmail);
  const canPayWithCard =
    isEmailValid &&
    cardNumber.replace(/\s/g, '').length === 16 &&
    EXPIRY_PATTERN.test(expiry) &&
    CVC_PATTERN.test(cvc);
  const priceLabel =
    plan.period === 'one-time' ? formatUsd(plan.amountCents) : `${formatUsd(plan.amountCents)}${plan.period}`;

  const handleCardSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (canPayWithCard && !isVerifying) onSubmit(trimmedEmail);
  };

  return (
    <form onSubmit={handleCardSubmit} className="flex flex-col px-6 pb-8 pt-5">
      <FieldCard label="Email Address (Where your high-res PDFs will be sent)" htmlFor="checkout-email">
        <input
          id="checkout-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="parent@example.com"
          value={email}
          disabled={isVerifying}
          onChange={(event) => setEmail(event.target.value)}
          className={INPUT_CLASS}
        />
      </FieldCard>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={() => onSubmit(trimmedEmail)}
          disabled={!isEmailValid || isVerifying}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3.5 text-base font-semibold text-white transition hover:bg-ink-800 active:scale-[0.98] disabled:bg-ink-200 disabled:text-ink-600"
        >
          <Apple className="h-5 w-5 fill-current" />
          Pay with Apple Pay
        </button>
        <button
          type="button"
          onClick={() => onSubmit(trimmedEmail)}
          disabled={!isEmailValid || isVerifying}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-base font-semibold text-ink-900 ring-1 ring-ink-200 transition hover:bg-ink-50 active:scale-[0.98] disabled:bg-ink-100 disabled:text-ink-500"
        >
          <GoogleWordmark />
          Pay with Google Pay
        </button>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-ink-400">
        <span className="h-px flex-1 bg-ink-200" />
        or pay with card
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <div className="space-y-3">
        <FieldCard label="Card number" htmlFor="checkout-card">
          <input
            id="checkout-card"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            disabled={isVerifying}
            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
            className={`${INPUT_CLASS} tracking-wider`}
          />
        </FieldCard>

        <div className="grid grid-cols-2 gap-3">
          <FieldCard label="Expiry" htmlFor="checkout-expiry">
            <input
              id="checkout-expiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={expiry}
              disabled={isVerifying}
              onChange={(event) => setExpiry(formatExpiry(event.target.value))}
              className={INPUT_CLASS}
            />
          </FieldCard>
          <FieldCard label="CVC" htmlFor="checkout-cvc">
            <input
              id="checkout-cvc"
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={cvc}
              disabled={isVerifying}
              onChange={(event) => setCvc(event.target.value.replace(/\D/g, '').slice(0, 3))}
              className={INPUT_CLASS}
            />
          </FieldCard>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canPayWithCard || isVerifying}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 py-4 text-base font-bold text-white shadow-lg shadow-brand-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:translate-y-0 disabled:bg-none disabled:bg-ink-200 disabled:text-ink-600 disabled:shadow-none"
      >
        {isVerifying ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Verifying card...
          </>
        ) : (
          <>
            Pay {priceLabel} &amp; Generate Magic
            <Sparkles className="h-5 w-5" />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs leading-[1.5] text-ink-500">Demo checkout. No real card is charged.</p>
    </form>
  );
}

function GoogleWordmark() {
  return (
    <span aria-hidden="true" className="text-lg font-black leading-none text-[#4285F4]">
      G
    </span>
  );
}

function FieldCard({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-ink-100 transition focus-within:ring-2 focus-within:ring-brand-400">
      <label htmlFor={htmlFor} className="block text-xs font-bold leading-[1.4] text-ink-600">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}
