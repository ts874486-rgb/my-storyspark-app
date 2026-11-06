import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import type { AuthUser } from '@/hooks/useAuth';

interface WelcomeScreenProps {
  user: AuthUser | null;
  onStart: () => void;
  onOpenBookshelf: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  bookCount: number;
  planLabel: string;
}

const HERO_IMAGE_URL =
  'https://images.pexels.com/photos/7494480/pexels-photo-7494480.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function WelcomeScreen({
  user,
  onStart,
  onOpenBookshelf,
  onSignIn,
  onSignOut,
  bookCount,
  planLabel,
}: WelcomeScreenProps) {
  return (
    <section className="flex flex-1 flex-col px-6 pb-10 pt-8">
      <header className="relative z-30 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold text-ink-900">StorySpark AI</span>
        </div>
        <UserMenu
          user={user}
          bookCount={bookCount}
          planLabel={planLabel}
          onOpenBookshelf={onOpenBookshelf}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
        />
      </header>

      <div className="relative mt-8 min-h-[320px] flex-1 animate-fade-up overflow-hidden rounded-[2rem] bg-ink-100 shadow-xl shadow-brand-900/15">
        <img
          src={HERO_IMAGE_URL}
          alt="A child reading a storybook in a cozy bedroom"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-cream/50 to-transparent" />
        <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-brand-800 shadow-md">
          <BookOpen className="h-3.5 w-3.5" />
          Bedtime Storybook
        </span>
      </div>

      <div className="mt-10 animate-fade-up">
        <h1 className="font-display text-3xl font-semibold leading-[1.2] text-ink-900 sm:text-4xl">
          Turn Your Child Into the Hero of Their Own Story
        </h1>
        <p className="mt-4 text-base leading-[1.5] text-ink-500">
          Personalized bedtime adventures, written just for them in under a minute.
        </p>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 py-4 text-lg font-bold text-white shadow-lg shadow-brand-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
        >
          Create a Story Now (Preview Free)
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
