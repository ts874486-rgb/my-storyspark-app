import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlanId } from '@/data/pricingPlans';
import { fetchRemoteState, pushBookWithProfile, type RemoteState } from '@/lib/bookshelfRemote';
import { loadLocalState, migrateProfile, resetProfile, saveLocalState, upsertBook } from '@/lib/bookshelfState';
import type { BookshelfState, StoryBook, UserProfile } from '@/types';

export interface BookshelfApi {
  profile: UserProfile;
  books: StoryBook[];
  saveBook: (book: StoryBook) => void;
  unlockBook: (book: StoryBook, planId: PlanId, email: string) => void;
  migrateToUser: (userId: string) => void;
  resetForLogout: () => void;
}

function mergeRemoteState(local: BookshelfState, remote: RemoteState): BookshelfState {
  const profile: UserProfile = remote.user
    ? {
        ...local.profile,
        email: remote.user.email ?? local.profile.email,
        currentSubscription: remote.user.currentSubscription,
        trialUsed: remote.user.trialUsed,
      }
    : local.profile;

  const books = remote.books.reduce((merged, remoteBook) => {
    const localBook = merged.find((book) => book.id === remoteBook.id);
    if (!localBook) return upsertBook(merged, remoteBook);
    return upsertBook(merged, { ...localBook, isUnlocked: localBook.isUnlocked || remoteBook.isUnlocked });
  }, local.books);

  return { profile, books };
}

export function useBookshelf(): BookshelfApi {
  const [state, setState] = useState<BookshelfState>(loadLocalState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
    saveLocalState(state);
  }, [state]);

  useEffect(() => {
    let isCancelled = false;
    fetchRemoteState(stateRef.current.profile.id).then((remote) => {
      if (isCancelled || !remote) return;
      setState((previous) => mergeRemoteState(previous, remote));
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const saveBook = useCallback((book: StoryBook) => {
    setState((previous) => ({ ...previous, books: upsertBook(previous.books, book) }));
    void pushBookWithProfile(stateRef.current.profile, book);
  }, []);

  const unlockBook = useCallback((book: StoryBook, planId: PlanId, email: string) => {
    const unlocked: StoryBook = { ...book, isUnlocked: true };
    const profile: UserProfile = { ...stateRef.current.profile, email, currentSubscription: planId };
    setState((previous) => ({ profile, books: upsertBook(previous.books, unlocked) }));
    void pushBookWithProfile(profile, unlocked);
  }, []);

  const migrateToUser = useCallback((userId: string) => {
    setState((previous) => {
      const migrated = migrateProfile(previous, userId);
      void pushBookWithProfile(migrated.profile, migrated.books[0] ?? ({} as StoryBook));
      return migrated;
    });
  }, []);

  const resetForLogout = useCallback(() => {
    setState(resetProfile);
  }, []);

  return { profile: state.profile, books: state.books, saveBook, unlockBook, migrateToUser, resetForLogout };
}
