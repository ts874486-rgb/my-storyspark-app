import { ArrowLeft, BookOpen, Plus, Sparkles } from 'lucide-react';
import BookshelfBookCard from '@/components/BookshelfBookCard';
import type { StoryBook } from '@/types';

interface BookshelfScreenProps {
  books: StoryBook[];
  onBack: () => void;
  onOpenBook: (book: StoryBook) => void;
  onStart: () => void;
}

export default function BookshelfScreen({ books, onBack, onOpenBook, onStart }: BookshelfScreenProps) {
  return (
    <section className="flex flex-1 flex-col px-5 pb-10 pt-6 sm:px-6">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to home"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink-700 shadow-sm ring-1 ring-ink-100 transition hover:bg-brand-50 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">Your library</p>
          <h1 className="font-display text-2xl font-semibold leading-[1.2] text-ink-900">My Bookshelf</h1>
        </div>
      </header>

      {books.length === 0 ? (
        <div className="mt-8 flex flex-1 animate-fade-up flex-col items-center rounded-[2rem] bg-white px-6 py-10 text-center shadow-md shadow-ink-900/5 ring-1 ring-ink-100">
          <div className="relative flex h-40 w-40 items-center justify-center" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-brand-100" />
            <span className="absolute left-3 top-7 h-10 w-10 rounded-full bg-rose-100" />
            <span className="absolute bottom-5 right-4 h-8 w-8 rounded-full bg-amber-100" />
            <span className="relative flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-ink-100">
              <BookOpen className="h-9 w-9 text-brand-700" />
            </span>
            <Sparkles className="absolute right-5 top-6 h-5 w-5 text-amber-500" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-semibold leading-[1.2] text-ink-900">Your shelf is empty</h2>
          <p className="mt-3 max-w-xs text-sm leading-[1.5] text-ink-600">
            Every storybook you create will be saved here, ready to reopen whenever you like.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 py-4 text-base font-bold text-white shadow-lg shadow-brand-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
          >
            Start Your First Magical Journey
            <Sparkles className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {books.map((book) => (
              <li key={book.id} className="animate-fade-up">
                <BookshelfBookCard book={book} onOpen={onOpenBook} />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onStart}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-bold text-brand-800 shadow-sm ring-1 ring-ink-100 transition hover:bg-brand-50 active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Create Another Story
          </button>
        </>
      )}
    </section>
  );
}
