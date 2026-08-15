/*
# Create explanations and feedback tables (single-tenant, no auth)

## Purpose
This migration creates the database tables for the Medical Miscommunication Detector.
Users paste confusing medical text and receive plain-language explanations.
Past explanations are stored so users can revisit them, and users can leave
feedback on whether an explanation was clear.

## New Tables

### 1. explanations
- `id` (uuid, primary key) — unique identifier for each explanation
- `original_text` (text, not null) — the medical text the user submitted
- `plain_summary` (text, not null) — the simplified plain-language version
- `jargon_terms` (jsonb, default '[]') — array of {term, explanation} objects
- `confidence_level` (text, default 'medium') — 'high', 'medium', or 'low'
- `confidence_note` (text) — a note about what to double-check with a doctor
- `source` (text, default 'fallback') — 'ai' or 'fallback' (how the explanation was generated)
- `language` (text, default 'en') — the language of the explanation
- `created_at` (timestamptz, default now()) — when the explanation was created

### 2. feedback
- `id` (uuid, primary key) — unique identifier
- `explanation_id` (uuid, foreign key to explanations) — which explanation this feedback is about
- `was_clear` (boolean, not null) — whether the user found the explanation clear
- `comment` (text) — optional comment from the user
- `created_at` (timestamptz, default now()) — when the feedback was submitted

## Security
- RLS is enabled on both tables.
- This is a single-tenant app with no sign-in, so anon + authenticated roles
  can perform all CRUD operations. The data is intentionally public/shared.
- No user_id columns are used because there is no authentication.

## Notes
1. The jargon_terms column uses jsonb for flexible storage of term/explanation pairs.
2. An index is added on explanations.created_at for efficient history listing.
3. Feedback has ON DELETE CASCADE so if an explanation is removed, its feedback is too.
*/

CREATE TABLE IF NOT EXISTS explanations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text text NOT NULL,
  plain_summary text NOT NULL,
  jargon_terms jsonb NOT NULL DEFAULT '[]'::jsonb,
  confidence_level text NOT NULL DEFAULT 'medium',
  confidence_note text,
  source text NOT NULL DEFAULT 'fallback',
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  explanation_id uuid NOT NULL REFERENCES explanations(id) ON DELETE CASCADE,
  was_clear boolean NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Explanations: anon + authenticated CRUD (single-tenant, no auth)
DROP POLICY IF EXISTS "anon_select_explanations" ON explanations;
CREATE POLICY "anon_select_explanations" ON explanations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_explanations" ON explanations;
CREATE POLICY "anon_insert_explanations" ON explanations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_explanations" ON explanations;
CREATE POLICY "anon_update_explanations" ON explanations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_explanations" ON explanations;
CREATE POLICY "anon_delete_explanations" ON explanations FOR DELETE
  TO anon, authenticated USING (true);

-- Feedback: anon + authenticated CRUD (single-tenant, no auth)
DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
CREATE POLICY "anon_select_feedback" ON feedback FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback" ON feedback FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_feedback" ON feedback;
CREATE POLICY "anon_update_feedback" ON feedback FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_feedback" ON feedback;
CREATE POLICY "anon_delete_feedback" ON feedback FOR DELETE
  TO anon, authenticated USING (true);

-- Index for history listing
CREATE INDEX IF NOT EXISTS idx_explanations_created_at ON explanations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_explanation_id ON feedback (explanation_id);
