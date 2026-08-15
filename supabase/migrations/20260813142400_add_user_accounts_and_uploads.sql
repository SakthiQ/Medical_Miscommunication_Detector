/*
# Add user accounts, image uploads, and owner-scoped data

## Purpose
MedTranslate is transitioning from a single-tenant tool to a multi-user web app.
Users can now create accounts, and their explanation history is scoped to their account.
Uploaded medical report images are stored in Supabase Storage.

## Changes

### 1. explanations table — add user_id column
- Added `user_id` (uuid, nullable, defaults to auth.uid()) — links explanation to the user who created it.
- Existing rows (created anonymously) will have NULL user_id and are retained for backward compatibility.
- Added `image_path` (text, nullable) — storage path of an uploaded medical report image, if text was extracted from an image.

### 2. feedback table — add user_id column
- Added `user_id` (uuid, nullable, defaults to auth.uid()) — links feedback to the user who submitted it.

### 3. RLS Policy Updates
- explanations: Replaced anon-accessible policies with owner-scoped policies (TO authenticated, auth.uid() = user_id).
  - Anonymous rows (user_id IS NULL) are still readable by anon for backward compat via a separate SELECT policy.
  - Only authenticated users can insert/update/delete their own rows.
- feedback: Same pattern — owner-scoped for authenticated, existing anon rows remain readable.

### 4. Storage Bucket
- Created `reports` bucket (private) for medical report image uploads.
- Policies: authenticated users can upload/read/delete only their own files (path prefixed with their user_id).

## Security Notes
1. user_id columns default to auth.uid() so inserts from authenticated sessions work without the client passing user_id.
2. Storage paths are namespaced by user_id (e.g. `{user_id}/{filename}`) and policies enforce ownership.
3. The reports bucket is private — files are only accessible to the owning authenticated user.
*/

-- Add user_id and image_path to explanations
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'explanations' AND column_name = 'user_id') THEN
    ALTER TABLE explanations ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'explanations' AND column_name = 'image_path') THEN
    ALTER TABLE explanations ADD COLUMN image_path text;
  END IF;
END $$;

-- Add user_id to feedback
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feedback' AND column_name = 'user_id') THEN
    ALTER TABLE feedback ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
  END IF;
END $$;

-- Index for user-scoped history queries
CREATE INDEX IF NOT EXISTS idx_explanations_user_id ON explanations (user_id, created_at DESC);

-- =============================================================
-- explanations: Replace policies with owner-scoped + anon-read
-- =============================================================

-- Allow anon to read rows with no owner (legacy anonymous data)
DROP POLICY IF EXISTS "anon_select_explanations" ON explanations;
CREATE POLICY "anon_select_explanations" ON explanations FOR SELECT
  TO anon USING (user_id IS NULL);

-- Authenticated users can read their own rows + legacy anonymous rows
DROP POLICY IF EXISTS "auth_select_own_explanations" ON explanations;
CREATE POLICY "auth_select_own_explanations" ON explanations FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

-- Only authenticated users can insert their own rows
DROP POLICY IF EXISTS "anon_insert_explanations" ON explanations;
CREATE POLICY "auth_insert_own_explanations" ON explanations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own rows
DROP POLICY IF EXISTS "anon_update_explanations" ON explanations;
CREATE POLICY "auth_update_own_explanations" ON explanations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can delete their own rows
DROP POLICY IF EXISTS "anon_delete_explanations" ON explanations;
CREATE POLICY "auth_delete_own_explanations" ON explanations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =============================================================
-- feedback: Same pattern
-- =============================================================

DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
CREATE POLICY "anon_select_feedback" ON feedback FOR SELECT
  TO anon USING (user_id IS NULL);

DROP POLICY IF EXISTS "auth_select_own_feedback" ON feedback;
CREATE POLICY "auth_select_own_feedback" ON feedback FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "auth_insert_own_feedback" ON feedback FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "anon_update_feedback" ON feedback;
CREATE POLICY "auth_update_own_feedback" ON feedback FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "anon_delete_feedback" ON feedback;
CREATE POLICY "auth_delete_own_feedback" ON feedback FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =============================================================
-- Storage: Create private bucket for medical report images
-- =============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload files to their own folder
DROP POLICY IF EXISTS "auth_upload_reports" ON storage.objects;
CREATE POLICY "auth_upload_reports" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can read their own files
DROP POLICY IF EXISTS "auth_read_reports" ON storage.objects;
CREATE POLICY "auth_read_reports" ON storage.objects FOR SELECT
  TO authenticated USING (
    bucket_id = 'reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can delete their own files
DROP POLICY IF EXISTS "auth_delete_reports" ON storage.objects;
CREATE POLICY "auth_delete_reports" ON storage.objects FOR DELETE
  TO authenticated USING (
    bucket_id = 'reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
