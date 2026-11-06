import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Palette, Sparkles } from 'lucide-react';
import ThemeModal from '@/components/ThemeModal';
import { getStoryTheme } from '@/data/storyThemes';
import type { Gender, StoryProfile, StoryRequest } from '@/types';

interface DetailsScreenProps {
  profile: StoryProfile;
  onUpdate: (patch: Partial<StoryProfile>) => void;
  onBack: () => void;
  onGenerate: (request: StoryRequest) => void;
}

const AGE_OPTIONS = Array.from({ length: 9 }, (_, index) => index + 2);

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'boy', label: 'Boy' },
  { value: 'girl', label: 'Girl' },
];

const CARD_CLASS =
  'rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-100 transition duration-200 focus-within:ring-2 focus-within:ring-brand-400';
const LABEL_CLASS = 'text-sm font-bold text-ink-700';

export default function DetailsScreen({ profile, onUpdate, onBack, onGenerate }: DetailsScreenProps) {
  const [isThemeOpen, setIsThemeOpen] = useState(() => profile.themeId === null);
  const theme = getStoryTheme(profile.themeId);
  const name = profile.name.trim();
  const storyRequest: StoryRequest | null =
    theme && name && profile.age !== null && profile.gender !== null
      ? { name, age: profile.age, gender: profile.gender, themeId: theme.id }
      : null;

  return (
    <section className="flex flex-1 flex-col px-5 pb-8 pt-6">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to welcome"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-700 shadow-sm ring-1 ring-ink-100 transition hover:bg-ink-50 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-sm font-bold text-ink-500">Step 1 of 2</p>
      </header>

      <div className="mt-6 animate-fade-up">
        <h1 className="font-display text-3xl font-semibold leading-[1.2] text-ink-900">
          Tell us about your hero
        </h1>
        <p className="mt-2 text-base leading-[1.5] text-ink-500">
          A few quick details so every page feels personal.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className={CARD_CLASS}>
          <label htmlFor="child-name" className={LABEL_CLASS}>
            Child's Name
          </label>
          <input
            id="child-name"
            type="text"
            value={profile.name}
            maxLength={20}
            placeholder="e.g. Mia"
            autoComplete="off"
            onChange={(event) => onUpdate({ name: event.target.value })}
            className="mt-2 w-full bg-transparent font-display text-2xl font-semibold text-ink-900 placeholder:text-ink-300 focus:outline-none"
          />
        </div>

        <div className={CARD_CLASS}>
          <label htmlFor="child-age" className={LABEL_CLASS}>
            Child's Age
          </label>
          <div className="relative mt-2">
            <select
              id="child-age"
              value={profile.age ?? ''}
              onChange={(event) =>
                onUpdate({ age: event.target.value ? Number(event.target.value) : null })
              }
              className="w-full appearance-none bg-transparent pr-8 text-lg text-ink-900 focus:outline-none"
            >
              <option value="" disabled>
                Select age
              </option>
              {AGE_OPTIONS.map((age) => (
                <option key={age} value={age}>
                  {age} years old
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-500" />
          </div>
        </div>

        <div className={CARD_CLASS}>
          <p className={LABEL_CLASS}>Gender</p>
          <div role="radiogroup" aria-label="Gender" className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-ink-50 p-1">
            {GENDER_OPTIONS.map((option) => {
              const isActive = profile.gender === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onUpdate({ gender: option.value })}
                  className={`rounded-xl py-3 text-base font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-brand-700 shadow-md ring-1 ring-brand-200'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className={CARD_CLASS}>
          <p className={LABEL_CLASS}>Story Theme</p>
          <button
            type="button"
            onClick={() => setIsThemeOpen(true)}
            className="mt-3 flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 border-dashed border-ink-200 p-3 text-left transition hover:border-brand-400 hover:bg-brand-50 active:scale-[0.99]"
          >
            {theme ? (
              <>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.tileClass}`}>
                  <theme.icon className="h-5 w-5" />
                </span>
                <span className="flex-1 font-bold text-ink-900">{theme.title}</span>
                <Check className="h-5 w-5 text-brand-600" strokeWidth={3} />
              </>
            ) : (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-600">
                  <Palette className="h-5 w-5" />
                </span>
                <span className="flex-1 font-bold text-ink-700">Choose a Theme</span>
                <ArrowRight className="h-5 w-5 text-ink-500" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          disabled={!storyRequest}
          onClick={() => storyRequest && onGenerate(storyRequest)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 py-4 text-lg font-bold text-white shadow-lg shadow-brand-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-none disabled:bg-ink-200 disabled:text-ink-600 disabled:shadow-none"
        >
          Generate Magic Story
          <Sparkles className="h-5 w-5" />
        </button>
        {!storyRequest && (
          <p className="mt-3 text-center text-sm text-ink-500">Fill in every field to continue.</p>
        )}
      </div>

      {isThemeOpen && (
        <ThemeModal
          selectedId={profile.themeId}
          onSelect={(themeId) => {
            onUpdate({ themeId });
            setIsThemeOpen(false);
          }}
          onClose={() => setIsThemeOpen(false)}
        />
      )}
    </section>
  );
}
