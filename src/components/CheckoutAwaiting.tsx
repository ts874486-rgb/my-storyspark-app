import { ExternalLink, Loader2 } from 'lucide-react';

interface CheckoutAwaitingProps {
  email: string;
  onReopen: () => void;
}

export default function CheckoutAwaiting({ email, onReopen }: CheckoutAwaitingProps) {
  return (
    <div className="flex flex-col items-center px-6 pb-8 pt-10 text-center animate-fade-up">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <Loader2 className="h-9 w-9 animate-spin" />
      </span>
      <h2 className="mt-7 font-display text-2xl font-semibold leading-[1.2] text-ink-900">Waiting for your payment</h2>
      <p className="mt-3 text-sm leading-[1.5] text-ink-600">
        Finish paying in the secure page we opened. Your storybook unlocks here automatically as soon as the payment is
        confirmed.
      </p>
      <p className="mt-3 text-sm leading-[1.5] text-ink-600">
        Receipts and the printable PDF will be sent to <span className="break-all font-bold text-ink-900">{email}</span>.
      </p>
      <button
        type="button"
        onClick={onReopen}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-bold text-brand-800 shadow-sm ring-1 ring-ink-100 transition hover:bg-brand-50 active:scale-[0.98]"
      >
        <ExternalLink className="h-5 w-5" />
        Reopen Payment Page
      </button>
    </div>
  );
}
