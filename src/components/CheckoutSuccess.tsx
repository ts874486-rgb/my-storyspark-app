import { Check } from 'lucide-react';

interface CheckoutSuccessProps {
  email: string;
  onDone: () => void;
}

export default function CheckoutSuccess({ email, onDone }: CheckoutSuccessProps) {
  return (
    <div className="flex flex-col items-center px-6 pb-8 pt-10 text-center animate-fade-up">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-300/50" />
        <span className="relative flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-900/20">
          <Check className="h-10 w-10" strokeWidth={2.75} />
        </span>
      </div>

      <h2 className="mt-7 font-display text-2xl font-semibold leading-[1.2] text-ink-900">Payment Successful!</h2>
      <p className="mt-3 text-sm leading-[1.5] text-ink-600">
        Your personalized storybook has been successfully generated.
      </p>
      <p className="mt-3 text-sm leading-[1.5] text-ink-600">
        We have emailed the printable high-definition PDF book to{' '}
        <span className="break-all font-bold text-ink-900">{email}</span>.
      </p>

      <button
        type="button"
        onClick={onDone}
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 py-4 text-base font-bold text-white shadow-lg shadow-brand-900/20 transition active:scale-[0.98]"
      >
        View My Storybook
      </button>
    </div>
  );
}
