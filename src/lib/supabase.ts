import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadLocalState } from '@/lib/bookshelfState';

const SUPABASE_URL: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const OWNER_HEADER = 'x-owner-id';

function withOwnerHeader(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set(OWNER_HEADER, loadLocalState().profile.id);
  return fetch(input, { ...init, headers });
}

export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { fetch: withOwnerHeader } })
    : null;
