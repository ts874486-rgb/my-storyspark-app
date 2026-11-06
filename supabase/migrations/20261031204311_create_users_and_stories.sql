/*
# Create users and stories tables (owner-scoped, no sign-in)

1. New Tables
- `users`: one row per device profile. Columns: `id` (text, primary key, generated on the device), `email` (optional, captured at checkout), `current_subscription` (plan id, defaults to 'none'), `trial_used` (boolean), `created_at`.
- `stories`: one row per generated storybook. Columns: `id` (text, primary key), `user_id` (owner, references users), `child_name`, `age` (2 to 10), `theme` (space, dino, forest or jungle), `pages_content` (JSON list of page text and image URL), `is_unlocked` (boolean), `created_at`.

2. Helper function
- `request_owner_id()` reads the `x-owner-id` header that the app sends with every request. Policies compare it to the row owner, so each device only sees its own rows.

3. Security
- Row level security is enabled on both tables.
- Access is granted to the `anon` and `authenticated` roles only for the verbs the app uses (no delete).
- Every policy checks the owner header. Rows owned by other devices are never returned or changed.
- Limitation: the owner id is not a login. Protecting data against someone who learns another device's id needs sign-in, which is not part of this change.

4. Notes
- Statements are idempotent and safe to re-run.
- Nothing is dropped, renamed, or retyped.
*/

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text,
  current_subscription text NOT NULL DEFAULT 'none',
  trial_used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stories (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_name text NOT NULL,
  age integer NOT NULL CHECK (age BETWEEN 2 AND 10),
  theme text NOT NULL CHECK (theme IN ('space', 'dino', 'forest', 'jungle')),
  pages_content jsonb NOT NULL,
  is_unlocked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stories_user_id_idx ON stories (user_id);

CREATE OR REPLACE FUNCTION public.request_owner_id()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT nullif(current_setting('request.headers', true)::json ->> 'x-owner-id', '')
$$;

REVOKE EXECUTE ON FUNCTION public.request_owner_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_owner_id() TO anon, authenticated;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON stories TO anon, authenticated;

DROP POLICY IF EXISTS "owner_select_users" ON users;
CREATE POLICY "owner_select_users" ON users FOR SELECT
  TO anon, authenticated USING (id = public.request_owner_id());

DROP POLICY IF EXISTS "owner_insert_users" ON users;
CREATE POLICY "owner_insert_users" ON users FOR INSERT
  TO anon, authenticated WITH CHECK (id = public.request_owner_id());

DROP POLICY IF EXISTS "owner_update_users" ON users;
CREATE POLICY "owner_update_users" ON users FOR UPDATE
  TO anon, authenticated USING (id = public.request_owner_id()) WITH CHECK (id = public.request_owner_id());

DROP POLICY IF EXISTS "owner_select_stories" ON stories;
CREATE POLICY "owner_select_stories" ON stories FOR SELECT
  TO anon, authenticated USING (user_id = public.request_owner_id());

DROP POLICY IF EXISTS "owner_insert_stories" ON stories;
CREATE POLICY "owner_insert_stories" ON stories FOR INSERT
  TO anon, authenticated WITH CHECK (user_id = public.request_owner_id());

DROP POLICY IF EXISTS "owner_update_stories" ON stories;
CREATE POLICY "owner_update_stories" ON stories FOR UPDATE
  TO anon, authenticated USING (user_id = public.request_owner_id()) WITH CHECK (user_id = public.request_owner_id());
