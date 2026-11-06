import { useEffect, useRef, useState } from 'react';
import { BookOpen, LogOut, User } from 'lucide-react';
import type { AuthUser } from '@/hooks/useAuth';

interface UserMenuProps {
  user: AuthUser | null;
  bookCount: number;
  planLabel: string;
  onOpenBookshelf: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function UserMenu({ user, bookCount, planLabel, onOpenBookshelf, onSignIn, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const initials = user
    ? user.email
        .slice(0, 2)
        .toUpperCase()
    : null;

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => (user ? setIsOpen((open) => !open) : onSignIn())}
        aria-label={user ? 'Open account menu' : 'Sign in'}
        aria-expanded={isOpen}
        aria-haspopup={user ? 'menu' : undefined}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-700 shadow-sm ring-1 ring-ink-100 transition hover:bg-brand-50 active:scale-95"
      >
        {initials ? (
          <span className="text-sm font-bold text-brand-700">{initials}</span>
        ) : (
          <User className="h-5 w-5" />
        )}
      </button>

      {isOpen && user && (
        <div
          role="menu"
          className="absolute right-0 top-14 z-40 w-72 origin-top-right animate-fade-up rounded-2xl bg-white p-2 shadow-xl shadow-ink-900/10 ring-1 ring-ink-100"
        >
          <div className="px-3 pb-2 pt-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">Welcome back</p>
            <p className="mt-1 truncate text-sm font-semibold text-ink-900">{user.email}</p>
            <p className="mt-0.5 text-xs font-medium text-ink-600">{planLabel}</p>
          </div>
          <div className="my-1 h-px bg-ink-100" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onOpenBookshelf();
            }}
            className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-ink-800 transition hover:bg-brand-50 active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-brand-700" />
              My Bookshelf
            </span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800">{bookCount}</span>
          </button>
          <div className="my-1 h-px bg-ink-100" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-2 rounded-xl bg-ink-50 px-3 py-3 text-left text-sm font-bold text-ink-600 transition hover:bg-ink-100 active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4 text-ink-500" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
