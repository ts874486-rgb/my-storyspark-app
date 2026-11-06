import { isStoryPage } from '@/lib/bookshelfState';
import { STORY_THEMES } from '@/data/storyThemes';
import { supabase } from '@/lib/supabase';
import type { StoryBook, UserProfile } from '@/types';

export interface RemoteState {
  user: UserProfile | null;
  books: StoryBook[];
}

function parseUserRow(row: unknown): UserProfile | null {
  if (typeof row !== 'object' || row === null) return null;
  const r = row as Record<string, unknown>;
  if (typeof r.id !== 'string' || typeof r.current_subscription !== 'string' || typeof r.trial_used !== 'boolean') {
    return null;
  }
  return {
    id: r.id,
    email: typeof r.email === 'string' ? r.email : null,
    currentSubscription: r.current_subscription,
    trialUsed: r.trial_used,
  };
}

function parseStoryRow(row: unknown): StoryBook | null {
  if (typeof row !== 'object' || row === null) return null;
  const r = row as Record<string, unknown>;
  const themeId = STORY_THEMES.find((theme) => theme.id === r.theme)?.id;
  if (
    typeof r.id !== 'string' ||
    typeof r.child_name !== 'string' ||
    typeof r.age !== 'number' ||
    !themeId ||
    typeof r.is_unlocked !== 'boolean' ||
    typeof r.created_at !== 'string' ||
    typeof r.title !== 'string' ||
    !Array.isArray(r.pages_content) ||
    !r.pages_content.every(isStoryPage)
  ) {
    return null;
  }
  return {
    id: r.id,
    title: r.title,
    childName: r.child_name,
    age: r.age,
    themeId,
    pages: r.pages_content,
    isUnlocked: r.is_unlocked,
    createdAt: r.created_at,
  };
}

export async function fetchRemoteState(ownerId: string): Promise<RemoteState | null> {
  if (!supabase) return null;
  try {
    const [userResult, storiesResult] = await Promise.all([
      supabase
        .from('users')
        .select('id, email, current_subscription, trial_used')
        .eq('id', ownerId)
        .maybeSingle(),
      supabase
        .from('stories')
        .select('id, title, child_name, age, theme, pages_content, is_unlocked, created_at')
        .eq('user_id', ownerId)
        .order('created_at', { ascending: false }),
    ]);
    if (userResult.error || storiesResult.error || !Array.isArray(storiesResult.data)) return null;
    return {
      user: userResult.data ? parseUserRow(userResult.data) : null,
      books: storiesResult.data.map(parseStoryRow).filter((book): book is StoryBook => book !== null),
    };
  } catch {
    return null;
  }
}

export async function pushBookWithProfile(profile: UserProfile, book: StoryBook): Promise<boolean> {
  if (!supabase) return false;
  try {
    const userResult = await supabase.from('users').upsert({
      id: profile.id,
      email: profile.email,
      current_subscription: profile.currentSubscription,
      trial_used: profile.trialUsed,
    });
    if (userResult.error) return false;

    const storyResult = await supabase.from('stories').upsert({
      id: book.id,
      user_id: profile.id,
      title: book.title,
      child_name: book.childName,
      age: book.age,
      theme: book.themeId,
      pages_content: book.pages,
      is_unlocked: book.isUnlocked,
      created_at: book.createdAt,
    });
    return !storyResult.error;
  } catch {
    return false;
  }
}
