import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getStoryTheme } from '@/data/storyThemes';
import type { StoryRequest } from '@/types';

const LOADING_DURATION_MS = 4000;
const LOADING_MESSAGES = [
  'Twinkling the stars...',
  'Writing your 10-page fairy tale...',
  'Painting every illustration...',
  'Binding your beautiful storybook...',
];
const MESSAGE_INTERVAL_MS = LOADING_DURATION_MS / LOADING_MESSAGES.length;

interface StoryLoadingScreenProps {
  request: StoryRequest;
  onComplete: () => void;
}

export default function StoryLoadingScreen({ request, onComplete }: StoryLoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const Icon = getStoryTheme(request.themeId)?.icon ?? Sparkles;

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((index) => Math.min(index + 1, LOADING_MESSAGES.length - 1));
    }, MESSAGE_INTERVAL_MS);
    const completeTimer = window.setTimeout(onComplete, LOADING_DURATION_MS);

    return () => {
      window.clearInterval(messageTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-200/60" />
        <span className="relative flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-white shadow-xl shadow-brand-900/10 ring-1 ring-brand-100">
          <Icon className="h-11 w-11 text-brand-600" strokeWidth={1.75} />
        </span>
      </div>

      <h1 className="mt-10 break-words font-display text-3xl font-semibold leading-[1.2] text-ink-900">
        Creating {request.name}&apos;s story
      </h1>
      <p key={messageIndex} aria-live="polite" className="mt-4 min-h-[1.5rem] animate-fade-up text-base text-ink-600">
        {LOADING_MESSAGES[messageIndex]}
      </p>

      <div className="mt-10 h-1.5 w-56 overflow-hidden rounded-full bg-ink-100">
        <div className="h-full w-0 animate-progress-fill rounded-full bg-gradient-to-r from-brand-500 to-sky-500" />
      </div>
    </section>
  );
}
