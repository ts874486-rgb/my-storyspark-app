import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

const SESSION_KEY = 'storyspark.session.v1';

export interface AuthUser {
  id: string;
  email: string;
}

interface StoredSession {
  id: string;
  email: string;
}

function readStoredSession(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const s = parsed as StoredSession;
    if (typeof s.id !== 'string' || typeof s.email !== 'string') return null;
    return { id: s.id, email: s.email };
  } catch {
    return null;
  }
}

function writeStoredSession(user: AuthUser | null): void {
  try {
    if (user) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // localStorage may be disabled in private browsing
  }
}

export interface AuthApi {
  user: AuthUser | null;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; user?: AuthUser | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; user?: AuthUser | null }>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthApi {
  const [user, setUser] = useState<AuthUser | null>(readStoredSession);
  const [isReady, setIsReady] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (!supabase) {
      setIsReady(true);
      return;
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        const sUser = session?.user;
        if (sUser && sUser.email) {
          const next: AuthUser = { id: sUser.id, email: sUser.email };
          writeStoredSession(next);
          if (isMounted.current) setUser(next);
        } else if (event === 'SIGNED_OUT') {
          writeStoredSession(null);
          if (isMounted.current) setUser(null);
        }
        if (isMounted.current) setIsReady(true);
      })();
    });

    (async () => {
      const { data: existing } = await supabase.auth.getSession();
      const sUser = existing.session?.user;
      if (sUser && sUser.email) {
        const next: AuthUser = { id: sUser.id, email: sUser.email };
        writeStoredSession(next);
        if (isMounted.current) setUser(next);
      }
      if (isMounted.current) setIsReady(true);
    })();

    return () => {
      isMounted.current = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null; user?: AuthUser | null }> => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      const sUser = data.user;
      if (sUser && sUser.email) {
        const next: AuthUser = { id: sUser.id, email: sUser.email };
        writeStoredSession(next);
        setUser(next);
        return { error: null, user: next };
      }
      return { error: null };
    }
    // Local fallback
    const fallback: AuthUser = { id: `local-${btoa(email).slice(0, 16)}`, email };
    writeStoredSession(fallback);
    setUser(fallback);
    return { error: null, user: fallback };
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<{ error: string | null; user?: AuthUser | null }> => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      const sUser = data.user;
      if (sUser && sUser.email) {
        const next: AuthUser = { id: sUser.id, email: sUser.email };
        writeStoredSession(next);
        setUser(next);
        return { error: null, user: next };
      }
      return { error: null };
    }
    // Local fallback
    const fallback: AuthUser = { id: `local-${btoa(email).slice(0, 16)}`, email };
    writeStoredSession(fallback);
    setUser(fallback);
    return { error: null, user: fallback };
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    writeStoredSession(null);
    setUser(null);
  }, []);

  return { user, isReady, signIn, signUp, signOut };
}
