import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { AuthApi, AuthUser } from '@/hooks/useAuth';

interface AuthModalProps {
  auth: AuthApi;
  intent: 'bookshelf' | 'generate' | 'checkout';
  onClose: () => void;
  onSuccess: (user: AuthUser | null) => void;
}

type AuthMode = 'signin' | 'signup';

const INTENT_COPY: Record<AuthModalProps['intent'], { title: string; subtitle: string }> = {
  bookshelf: {
    title: 'Sign in to see your bookshelf',
    subtitle: 'Your saved stories are tied to your account.',
  },
  generate: {
    title: 'Create a free account to save stories',
    subtitle: "We'll save every book to your personal library.",
  },
  checkout: {
    title: 'Sign in to complete your purchase',
    subtitle: 'Your subscription is linked to your account.',
  },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({ auth, intent, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(intent === 'generate' ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = INTENT_COPY[intent];
  const trimmedEmail = email.trim();
  const isValid = EMAIL_PATTERN.test(trimmedEmail) && password.length >= 6;

  const switchMode = (next: AuthMode) => {
    if (next === mode || isSubmitting) return;
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    const result = mode === 'signin' ? await auth.signIn(trimmedEmail, password) : await auth.signUp(trimmedEmail, password);

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onSuccess(result.user ?? null);
  };

  const buttonText = mode === 'signin' ? 'Sign In to Your Magic Vault' : 'Create Free Parent Account';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 backdrop-blur-sm animate-fade-in"
      onClick={isSubmitting ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-md animate-slide-up-sheet flex-col rounded-t-[2rem] bg-cream shadow-2xl"
      >
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-12 rounded-full bg-ink-200" />
        </div>

        <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-5">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
              {mode === 'signin' ? <ShieldCheck className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
              {mode === 'signin' ? 'Welcome back' : 'Get started'}
            </p>
            <h2 id="auth-modal-title" className="mt-1.5 font-display text-2xl font-semibold leading-[1.2] text-ink-900">
              {copy.title}
            </h2>
            <p className="mt-1 text-sm leading-[1.5] text-ink-500">{copy.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition hover:bg-ink-200 active:scale-95 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="px-6 pt-3">
          <div className="flex rounded-2xl bg-white p-1 ring-1 ring-ink-100">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              disabled={isSubmitting}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 ${
                mode === 'signin' ? 'bg-brand-600 text-white shadow-md shadow-brand-900/15' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              disabled={isSubmitting}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 ${
                mode === 'signup' ? 'bg-brand-600 text-white shadow-md shadow-brand-900/15' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col px-6 pb-8 pt-4">
          <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-ink-100 transition focus-within:ring-2 focus-within:ring-brand-400">
            <label htmlFor="auth-email" className="block text-xs font-bold leading-[1.4] text-ink-600">
              Email Address
            </label>
            <div className="mt-1 flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-ink-400" />
              <input
                id="auth-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="parent@example.com"
                value={email}
                disabled={isSubmitting}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-base text-ink-900 placeholder:text-ink-300 focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-ink-100 transition focus-within:ring-2 focus-within:ring-brand-400">
            <label htmlFor="auth-password" className="block text-xs font-bold leading-[1.4] text-ink-600">
              Password
            </label>
            <div className="mt-1 flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0 text-ink-400" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                placeholder="At least 6 characters"
                value={password}
                disabled={isSubmitting}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-base text-ink-900 placeholder:text-ink-300 focus:outline-none disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="shrink-0 text-ink-400 transition hover:text-ink-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 py-4 text-base font-bold text-white shadow-lg shadow-brand-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:translate-y-0 disabled:bg-none disabled:bg-ink-200 disabled:text-ink-600 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              buttonText
            )}
          </button>

          <p className="mt-4 text-center text-sm font-medium text-ink-500">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              disabled={isSubmitting}
              className="font-bold text-brand-700 underline-offset-2 transition hover:underline disabled:opacity-40"
            >
              {mode === 'signin' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
