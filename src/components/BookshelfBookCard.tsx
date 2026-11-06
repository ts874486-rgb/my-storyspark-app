import { Calendar, CheckCircle2, Lock, Sparkles, type LucideIcon } from 'lucide-react';
import { getStoryTheme } from '@/data/storyThemes';
import type { StoryBook } from '@/types';

interface BookshelfBookCardProps {
  book: StoryBook;
  onOpen: (book: StoryBook) => void;
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function formatCreatedDate(createdAt: string): string {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? 'Unknown date' : DATE_FORMAT.format(date);
}

function MetaTag({ icon: Icon, label }: { icon?: LucideIcon; label: string }) {
  return (
    <li className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs font-bold text-ink-700 ring-1 ring-ink-100">
      {Icon && <Icon className="h-3.5 w-3.5 text-brand-700" />}
      {label}
    </li>
  );
}

export default function BookshelfBookCard({ book, onOpen }: BookshelfBookCardProps) {
  const theme = getStoryTheme(book.themeId);
  const ThemeIcon = theme?.icon ?? Sparkles;
  const themeTitle = theme?.title ?? 'Adventure';
  const coverUrl = book.pages[0]?.imageUrl;
  const title = book.title || `${book.childName}'s ${themeTitle}`;

  return (
    <button
      type="button"
      onClick={() => onOpen(book)}
      aria-label={`Open ${title}`}
      className="group block w-full overflow-hidden rounded-[1.75rem] bg-white text-left shadow-md shadow-ink-900/5 ring-1 ring-ink-100 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-100">
        {coverUrl && (
          <img
            src={coverUrl}
            alt=""
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <span
          className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
            book.isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-white/95 text-ink-700'
          }`}
        >
          {book.isUnlocked ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          {book.isUnlocked ? 'Unlocked' : 'Preview'}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme?.tileClass ?? 'bg-ink-100 text-ink-700'}`}>
            <ThemeIcon className="h-5 w-5" />
          </span>
          <p className="min-w-0 truncate font-display text-lg font-semibold leading-[1.2] text-ink-900">{title}</p>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          <MetaTag label={`Ages ${book.age}`} />
          <MetaTag label={themeTitle} />
          <MetaTag icon={Calendar} label={formatCreatedDate(book.createdAt)} />
        </ul>
      </div>
    </button>
  );
}
