/*
# Add title column to stories table

1. Modified Tables
- `stories`: adds `title` (text, not null, default 'Untitled Story') to store the generated storybook title.

2. Security
- No changes to RLS policies or grants. The existing owner-based policies on `stories` continue to apply to the new column.

3. Notes
- Idempotent: uses DO $$ ... IF NOT EXISTS ... END $$ so re-running is safe.
- No data is lost — existing rows get the default 'Untitled Story' value.
- The column is added to the table's existing INSERT/UPDATE grants for anon and authenticated roles.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stories' AND column_name = 'title'
  ) THEN
    ALTER TABLE stories ADD COLUMN title text NOT NULL DEFAULT 'Untitled Story';
  END IF;
END $$;
