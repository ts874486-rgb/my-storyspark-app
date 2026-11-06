import { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { STORY_THEMES } from '@/data/storyThemes';
import type { ThemeId } from '@/types';

interface ThemeModalProps {
  selectedId: ThemeId | null;
  onSelect: (id: ThemeId) => void;
  onClose: () => void;
}

export default function ThemeModal({ selectedId, onSelect, onClose }: ThemeModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md animate-sheet-up rounded-t-[2rem] bg-white p-6 pb-8 shadow-2xl sm:rounded-[2rem]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="theme-modal-title" className="font-display text-2xl font-semibold leading-[1.2] text-ink-900">
              Choose a Theme
            </h2>
            <p className="mt-1 text-sm text-ink-500">Pick the world your hero will explore.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close theme picker"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition hover:bg-ink-200 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="mt-6 flex flex-col gap-3">
          {STORY_THEMES.map((theme) => {
            const isActive = theme.id === selectedId;
            return (
              <li key={theme.id}>
                <button
                  type="button"
                  onClick={() => onSelect(theme.id)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
                    isActive ? 'border-brand-500 bg-brand-50' : 'border-transparent bg-ink-50 hover:border-ink-200'
                  }`}
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${theme.tileClass}`}>
                    <theme.icon className="h-6 w-6" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold text-ink-900">{theme.title}</span>
                    <span className="block text-sm leading-[1.5] text-ink-500">{theme.description}</span>
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition duration-200 ${
                      isActive ? 'bg-brand-600 text-white' : 'border-2 border-ink-200'
                    }`}
                  >
                    {isActive && <Check className="h-4 w-4" strokeWidth={3} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
