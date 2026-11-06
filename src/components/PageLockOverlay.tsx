import { Lock } from 'lucide-react';

interface PageLockOverlayProps {
  pageCount: number;
  onUnlock: () => void;
}

export default function PageLockOverlay({ pageCount, onUnlock }: PageLockOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-cream/30 p-5 backdrop-blur-md animate-fade-in">
      <div className="pointer-events-auto w-full max-w-xs animate-fade-up rounded-3xl bg-white/95 p-6 text-center shadow-xl shadow-ink-900/10 ring-1 ring-ink-100">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Lock className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold leading-[1.2] text-ink-900">
          Premium Pages Locked
        </h3>
        <p className="mt-2 text-sm leading-[1.5] text-ink-600">
          Subscribe to read all {pageCount} illustrated pages and download the full printable PDF.
        </p>
        <button
          type="button"
          onClick={onUnlock}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 py-3 text-sm font-bold text-white shadow-md shadow-brand-900/20 transition active:scale-[0.98]"
        >
          View Plans
        </button>
      </div>
    </div>
  );
}
