import { useEffect, useState } from 'react';
import { CheckCircle2, Download } from 'lucide-react';

interface PdfDownloadDialogProps {
  pageCount: number;
  onClose: () => void;
}

type DownloadStatus = 'assembling' | 'ready';

const ASSEMBLY_DURATION_MS = 2500;

export default function PdfDownloadDialog({ pageCount, onClose }: PdfDownloadDialogProps) {
  const [status, setStatus] = useState<DownloadStatus>('assembling');
  const isAssembling = status === 'assembling';

  useEffect(() => {
    if (!isAssembling) return;
    const timer = window.setTimeout(() => setStatus('ready'), ASSEMBLY_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [isAssembling]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isAssembling) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAssembling, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-5 backdrop-blur-sm animate-fade-in"
      onClick={isAssembling ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm animate-fade-up rounded-[2rem] bg-cream p-7 text-center shadow-2xl"
      >
        {isAssembling ? (
          <>
            <span className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Download className="h-7 w-7" />
            </span>
            <h2 id="pdf-dialog-title" className="mt-5 font-display text-xl font-semibold leading-[1.2] text-ink-900">
              Assembling your high-res book...
            </h2>
            <p className="mt-2 text-sm leading-[1.5] text-ink-600">
              {pageCount} illustrated pages in Full HD print quality
            </p>
            <div
              role="progressbar"
              aria-label="PDF assembly progress"
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-ink-100"
            >
              <div className="h-full w-0 animate-progress-fill rounded-full bg-gradient-to-r from-brand-500 to-sky-500" />
            </div>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-900/20">
              <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
            </span>
            <h2 id="pdf-dialog-title" className="mt-5 font-display text-xl font-semibold leading-[1.2] text-ink-900">
              Your printable book is ready
            </h2>
            <p className="mt-2 text-sm leading-[1.5] text-ink-600">
              The Full HD PDF with all {pageCount} pages is ready to print at home or at your favorite print shop.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 w-full rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 py-4 text-base font-bold text-white shadow-lg shadow-brand-900/20 transition active:scale-[0.98]"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
