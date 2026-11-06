import { useEffect, useRef, useState, type UIEvent } from 'react';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Download, Lock, Sparkles } from 'lucide-react';
import PdfDownloadDialog from '@/components/PdfDownloadDialog';
import PricingSheet from '@/components/PricingSheet';
import StoryPageCard from '@/components/StoryPageCard';
import UserMenu from '@/components/UserMenu';
import { getPlanName, type PricingPlan } from '@/data/pricingPlans';
import type { AuthUser } from '@/hooks/useAuth';
import type { BookshelfApi } from '@/hooks/useBookshelf';
import { createStoryBook } from '@/lib/bookshelfState';
import { generateStory } from '@/lib/storyGenerator';
import type { PreviewSource, StoryBook } from '@/types';

interface StoryPreviewScreenProps {
  source: PreviewSource;
  bookshelf: BookshelfApi;
  user: AuthUser | null;
  onBack: () => void;
  onCreateAnother: () => void;
  onOpenBookshelf: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onRequireCheckout: (action: () => void) => void;
}

export default function StoryPreviewScreen({
  source,
  bookshelf,
  user,
  onBack,
  onCreateAnother,
  onOpenBookshelf,
  onSignIn,
  onSignOut,
  onRequireCheckout,
}: StoryPreviewScreenProps) {
  const { profile, books, saveBook, unlockBook } = bookshelf;
  const [book, setBook] = useState<StoryBook | null>(source.kind === 'saved' ? source.book : null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const childName = source.kind === 'new' ? source.request.name : source.book.childName;
  const themeId = source.kind === 'new' ? source.request.themeId : source.book.themeId;
  const isPaid = book?.isUnlocked ?? false;
  const pages = book?.pages ?? null;
  const planName = getPlanName(profile.currentSubscription);
  const bookCount = books.length;

  useEffect(() => {
    if (source.kind !== 'new') return;
    let isCancelled = false;
    const request = source.request;
    generateStory(request).then((result) => {
      if (isCancelled) return;
      const created = createStoryBook(request, result.pages, result.title);
      setBook(created);
      saveBook(created);
    });
    return () => {
      isCancelled = true;
    };
  }, [source, saveBook]);

  const goToPage = (index: number) => {
    const track = trackRef.current;
    if (!track || !pages) return;
    const nextIndex = Math.min(Math.max(index, 0), pages.length - 1);
    track.scrollTo({ left: nextIndex * track.clientWidth, behavior: 'smooth' });
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    if (track.clientWidth === 0) return;
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  const handlePaid = (plan: PricingPlan, email: string) => {
    if (!book) return;
    const unlocked: StoryBook = { ...book, isUnlocked: true };
    setBook(unlocked);
    unlockBook(unlocked, plan.id, email);
    setIsPricingOpen(false);
  };

  const displayTitle = book?.title ?? `${childName}'s Custom Adventure`;

  return (
    <section className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-100 bg-cream/90 px-5 py-4 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink-700 shadow-sm ring-1 ring-ink-100 transition hover:bg-ink-50 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-semibold leading-[1.2] text-ink-900">{displayTitle}</h1>
          <p className="truncate text-xs font-medium text-ink-500">{childName}'s Custom Adventure</p>
        </div>
        <button
          type="button"
          onClick={onCreateAnother}
          aria-label="Create Another Story"
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-white px-3 text-sm font-bold text-brand-700 shadow-sm ring-1 ring-brand-200 transition hover:bg-brand-50 active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">New Story</span>
        </button>
        {isPaid && (
          <button
            type="button"
            onClick={() => setIsDownloadOpen(true)}
            aria-label="Download Full HD Printable PDF"
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-sky-600 px-4 text-sm font-bold text-white shadow-md shadow-brand-900/20 transition active:scale-95"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
        )}
        <UserMenu
          user={user}
          bookCount={bookCount}
          planLabel={planName ?? 'Free preview'}
          onOpenBookshelf={onOpenBookshelf}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
        />
      </header>

      {pages === null ? (
        <div className="px-5 pt-6">
          <div className="aspect-[4/3] w-full animate-pulse rounded-[1.75rem] bg-ink-100" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-ink-100" />
            <div className="h-4 w-full animate-pulse rounded-full bg-ink-100" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-ink-100" />
          </div>
        </div>
      ) : (
        <>
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex flex-1 snap-x snap-mandatory touch-pan-x overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {pages.map((page, index) => (
              <StoryPageCard
                key={index}
                page={page}
                index={index}
                pageCount={pages.length}
                childName={childName}
                themeId={themeId}
                isLocked={!isPaid}
                isActive={index === activeIndex}
                onUnlock={() => onRequireCheckout(() => setIsPricingOpen(true))}
                onDownload={() => setIsDownloadOpen(true)}
              />
            ))}
          </div>

          <nav className="flex items-center justify-between gap-2 px-5 pt-4" aria-label="Story pages">
            <button
              type="button"
              onClick={() => goToPage(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous page"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink-700 shadow-sm ring-1 ring-ink-100 transition hover:bg-ink-50 active:scale-95 disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex h-12 flex-1 items-center justify-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {pages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToPage(index)}
                  aria-label={`Go to page ${index + 1}`}
                  aria-current={index === activeIndex}
                  className="flex h-8 w-5 shrink-0 items-center justify-center"
                >
                  <span
                    className={`rounded-full transition-all duration-300 ${
                      index === activeIndex ? 'h-2.5 w-5 bg-brand-600' : 'h-2 w-2 bg-ink-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => goToPage(activeIndex + 1)}
              disabled={activeIndex === pages.length - 1}
              aria-label="Next page"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink-700 shadow-sm ring-1 ring-ink-100 transition hover:bg-ink-50 active:scale-95 disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
          <p className="px-5 pb-1 text-center text-xs font-bold tracking-[0.16em] text-ink-500">
            PAGE {activeIndex + 1} OF {pages.length}
          </p>
        </>
      )}

      <div className="sticky bottom-0 z-20 mt-auto border-t border-ink-100 bg-white/95 px-5 py-4 shadow-[0_-8px_24px_-12px_rgba(28,27,25,0.2)] backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          {isPaid ? (
            <p className="flex items-center gap-2 text-sm font-bold leading-[1.5] text-emerald-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              Unlocked with {planName ?? 'your plan'}
            </p>
          ) : (
            <>
              <p className="text-sm leading-[1.5] text-ink-700">
                Unlock Full HD Printable PDF for <span className="font-bold text-ink-900">$6.99</span>
              </p>
              <button
                type="button"
                onClick={() => onRequireCheckout(() => setIsPricingOpen(true))}
                disabled={pages === null}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] disabled:translate-y-0 disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                Unlock
              </button>
            </>
          )}
        </div>
      </div>

      {isDownloadOpen && pages && <PdfDownloadDialog pageCount={pages.length} onClose={() => setIsDownloadOpen(false)} />}

      {isPricingOpen && book && (
        <PricingSheet
          bookId={book.id}
          defaultEmail={user?.email ?? bookshelf.profile.email ?? ''}
          onClose={() => setIsPricingOpen(false)}
          onPaid={handlePaid}
        />
      )}
    </section>
  );
}
