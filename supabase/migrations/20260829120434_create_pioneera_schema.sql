/*
# Pioneera.net — Magazine Database Schema

## Overview
Creates the full database schema for the Pioneera.net Arabic women's magazine.
The app has admin authentication (one admin account) but NO reader accounts.
Readers can comment without signing in (name + comment), subscribe to newsletter,
and browse articles. Only the admin can create/edit/delete articles and moderate comments.

## Tables

1. `articles` — Stores all magazine articles.
   - `id` (uuid, PK)
   - `title` (text, not null) — Article headline
   - `excerpt` (text) — Short summary shown in cards
   - `content` (text) — Full article body (rich text / markdown)
   - `category` (text, not null) — Category slug (fashion, beauty, health, family, food, decor, stars, video)
   - `image_url` (text) — Hero image URL
   - `author` (text, default 'Pioneera') — Author name
   - `is_featured` (boolean, default false) — Shown in hero section
   - `is_published` (boolean, default true) — Draft vs published
   - `views` (integer, default 0) — View count
   - `read_time` (text) — e.g. "٥ دقائق"
   - `created_at` (timestamptz, default now())
   - `updated_at` (timestamptz, default now())

2. `comments` — Reader comments on articles (no login required).
   - `id` (uuid, PK)
   - `article_id` (uuid, FK to articles, cascade delete)
   - `name` (text, not null) — Commenter display name
   - `content` (text, not null) — Comment text
   - `is_approved` (boolean, default false) — Admin moderation flag
   - `created_at` (timestamptz, default now())

3. `newsletter_subscribers` — Email subscribers.
   - `id` (uuid, PK)
   - `email` (text, unique, not null)
   - `subscribed_at` (timestamptz, default now())

## Security (RLS)

- `articles`: Public read for published articles. Only authenticated admin can insert/update/delete.
- `comments`: Public can insert (readers comment without login). Public can read only approved comments.
  Only authenticated admin can update (approve/reject) and delete.
- `newsletter_subscribers`: Public can insert (subscribe). Only authenticated admin can read.
  No update needed.

## Important Notes
1. The admin uses Supabase email/password auth. The admin account must be created
   via the auth flow in the frontend (sign up on first use, then sign in).
2. All public read policies use `TO anon, authenticated` so the anon-key frontend works.
3. Comment moderation is done through the admin dashboard.
4. View counting is handled via a SECURITY DEFINER function to allow anon increment.
*/

-- ===================== ARTICLES =====================
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  content text,
  category text NOT NULL,
  image_url text,
  author text NOT NULL DEFAULT 'Pioneera',
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  views integer NOT NULL DEFAULT 0,
  read_time text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
DROP POLICY IF EXISTS "public_read_articles" ON articles;
CREATE POLICY "public_read_articles"
ON articles FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Authenticated admin can insert
DROP POLICY IF EXISTS "admin_insert_articles" ON articles;
CREATE POLICY "admin_insert_articles"
ON articles FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated admin can update
DROP POLICY IF EXISTS "admin_update_articles" ON articles;
CREATE POLICY "admin_update_articles"
ON articles FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

-- Authenticated admin can delete
DROP POLICY IF EXISTS "admin_delete_articles" ON articles;
CREATE POLICY "admin_delete_articles"
ON articles FOR DELETE
TO authenticated
USING (true);

-- ===================== COMMENTS =====================
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  name text NOT NULL,
  content text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public can read approved comments only
DROP POLICY IF EXISTS "public_read_comments" ON comments;
CREATE POLICY "public_read_comments"
ON comments FOR SELECT
TO anon, authenticated
USING (is_approved = true);

-- Public can insert comments (no login needed)
DROP POLICY IF EXISTS "public_insert_comments" ON comments;
CREATE POLICY "public_insert_comments"
ON comments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated admin can update (approve/reject)
DROP POLICY IF EXISTS "admin_update_comments" ON comments;
CREATE POLICY "admin_update_comments"
ON comments FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

-- Authenticated admin can delete comments
DROP POLICY IF EXISTS "admin_delete_comments" ON comments;
CREATE POLICY "admin_delete_comments"
ON comments FOR DELETE
TO authenticated
USING (true);

-- ===================== NEWSLETTER SUBSCRIBERS =====================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public can subscribe (insert)
DROP POLICY IF EXISTS "public_subscribe_newsletter" ON newsletter_subscribers;
CREATE POLICY "public_subscribe_newsletter"
ON newsletter_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated admin can read subscribers
DROP POLICY IF EXISTS "admin_read_newsletter" ON newsletter_subscribers;
CREATE POLICY "admin_read_newsletter"
ON newsletter_subscribers FOR SELECT
TO authenticated
USING (true);

-- Authenticated admin can delete subscribers
DROP POLICY IF EXISTS "admin_delete_newsletter" ON newsletter_subscribers;
CREATE POLICY "admin_delete_newsletter"
ON newsletter_subscribers FOR DELETE
TO authenticated
USING (true);

-- ===================== INCREMENT VIEW COUNT FUNCTION =====================
-- SECURITY DEFINER so anon role can increment views without UPDATE policy on articles
CREATE OR REPLACE FUNCTION increment_article_view(article_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE articles SET views = views + 1 WHERE id = article_uuid;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_article_view TO anon, authenticated;

-- ===================== UPDATED_AT TRIGGER =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
