import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import PageLockOverlay from '@/components/PageLockOverlay';
import { getThemeImage } from '@/data/themeImages';
import type { StoryPage, ThemeId } from '@/types';

interface StoryPageCardProps {
  page: StoryPage;
  index: number;
  pageCount: number;
  childName: string;
  themeId: ThemeId;
  isLocked: boolean;
  isActive: boolean;
  onUnlock: () => void;
  onDownload: () => void;
}

export default function StoryPageCard({
  page,
  index,
  pageCount,
  childName,
  themeId,
  isLocked,
  isActive,
  onUnlock,
  onDownload,
}: StoryPageCardProps) {
  const isLastPage = index === pageCount - 1;
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false);
    setHasError(false);
  }, [isActive, index]);

  const imageUrl = isActive ? getThemeImage(themeId, index) : null;

  return (
    <article className="w-full shrink-0 snap-center px-5 pb-2 pt-6">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-2xl shadow-ink-900/10 ring-1 ring-ink-100">
        {isLocked && index > 0 && <PageLockOverlay pageCount={pageCount} onUnlock={onUnlock} />}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
          {!isImageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream via-brand-50/40 to-cream" />
          )}
          {imageUrl && !hasError && (
            <img
              src={imageUrl}
              alt={`Illustration for page ${index + 1} of ${childName}'s story`}
              draggable={false}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => {
                setHasError(true);
                setIsImageLoaded(true);
              }}
              className={`h-full w-full object-cover transition-opacity duration-700 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-cream">
              <div className="text-center">
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-brand-100" />
                <p className="text-xs font-medium text-ink-400">Illustration unavailable</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
            Page {index + 1} of {pageCount}
          </p>
          <p className="mt-4 text-lg leading-[1.5] text-ink-800 first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.9] first-letter:text-brand-600">
            {page.text}
          </p>
          {!isLocked && isLastPage && (
            <button
              type="button"
              onClick={onDownload}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 py-4 text-base font-bold text-white shadow-lg shadow-brand-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
            >
              <Download className="h-5 w-5" />
              Download Full HD Printable PDF
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
