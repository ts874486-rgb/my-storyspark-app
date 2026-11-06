import type { BookshelfState, StoryBook, StoryPage, StoryRequest, UserProfile } from '@/types';

const STORAGE_KEY = 'storyspark.bookshelf.v1';

export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function createDefaultState(): BookshelfState {
  return {
    profile: { id: createId(), email: null, currentSubscription: 'none', trialUsed: false },
    books: [],
  };
}

export function isStoryPage(value: unknown): value is StoryPage {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as StoryPage).text === 'string' &&
    typeof (value as StoryPage).imageUrl === 'string'
  );
}

function isStoryBook(value: unknown): value is StoryBook {
  if (typeof value !== 'object' || value === null) return false;
  const book = value as StoryBook;
  return (
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    typeof book.childName === 'string' &&
    typeof book.age === 'number' &&
    typeof book.themeId === 'string' &&
    Array.isArray(book.pages) &&
    book.pages.every(isStoryPage) &&
    typeof book.isUnlocked === 'boolean' &&
    typeof book.createdAt === 'string'
  );
}

function isUserProfile(value: unknown): value is UserProfile {
  if (typeof value !== 'object' || value === null) return false;
  const profile = value as UserProfile;
  return (
    typeof profile.id === 'string' &&
    (profile.email === null || typeof profile.email === 'string') &&
    typeof profile.currentSubscription === 'string' &&
    typeof profile.trialUsed === 'boolean'
  );
}

function readStoredState(): BookshelfState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { profile, books } = parsed as { profile?: unknown; books?: unknown };
    if (!isUserProfile(profile) || !Array.isArray(books)) return null;
    return { profile, books: books.filter(isStoryBook) };
  } catch {
    return null;
  }
}

export function loadLocalState(): BookshelfState {
  const stored = readStoredState();
  if (stored) return stored;
  const fresh = createDefaultState();
  saveLocalState(fresh);
  return fresh;
}

export function saveLocalState(state: BookshelfState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be full or disabled in private browsing; the in-memory state keeps working.
  }
}

export function upsertBook(books: StoryBook[], book: StoryBook): StoryBook[] {
  const exists = books.some((existing) => existing.id === book.id);
  const next = exists ? books.map((existing) => (existing.id === book.id ? book : existing)) : [book, ...books];
  return next.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function migrateProfile(state: BookshelfState, newProfileId: string): BookshelfState {
  if (state.profile.id === newProfileId) return state;
  return {
    profile: {
      ...state.profile,
      id: newProfileId,
      email: state.profile.email ?? null,
      currentSubscription: 'none',
      trialUsed: false,
    },
    books: state.books.map((book) => ({ ...book, isUnlocked: false })),
  };
}

export function resetProfile(state: BookshelfState): BookshelfState {
  return {
    profile: { id: createId(), email: null, currentSubscription: 'none', trialUsed: false },
    books: [],
  };
}

export function createStoryBook(request: StoryRequest, pages: StoryPage[], title: string): StoryBook {
  return {
    id: createId(),
    title,
    childName: request.name,
    age: request.age,
    themeId: request.themeId,
    pages,
    isUnlocked: false,
    createdAt: new Date().toISOString(),
  };
}
