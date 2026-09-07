-- Canonical secure Pioneera schema baseline. New environments receive no
-- permissive policy at any point; legacy environments receive migration 2.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL CHECK (char_length(btrim(title)) > 0),
  excerpt text, content text, category text NOT NULL CHECK (char_length(btrim(category)) > 0), image_url text,
  author text NOT NULL DEFAULT 'Pioneera' CHECK (char_length(btrim(author)) > 0),
  is_featured boolean NOT NULL DEFAULT false, is_published boolean NOT NULL DEFAULT true,
  views integer NOT NULL DEFAULT 0 CHECK (views >= 0), read_time text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(btrim(name)) > 0), content text NOT NULL CHECK (char_length(btrim(content)) > 0),
  is_approved boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL CHECK (position('@' IN email) > 1),
  subscribed_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX newsletter_subscribers_email_lower_key ON public.newsletter_subscribers (lower(email));
CREATE INDEX articles_published_created_at_idx ON public.articles (created_at DESC) WHERE is_published;
CREATE INDEX articles_published_category_created_at_idx ON public.articles (category, created_at DESC) WHERE is_published;
CREATE INDEX comments_article_approved_created_at_idx ON public.comments (article_id, created_at DESC) WHERE is_approved;

CREATE FUNCTION public.pioneera_set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER articles_set_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.pioneera_set_updated_at();

CREATE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers FORCE ROW LEVEL SECURITY;

CREATE POLICY public_read_articles ON public.articles FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY admin_read_articles ON public.articles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY admin_insert_articles ON public.articles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY admin_update_articles ON public.articles FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY admin_delete_articles ON public.articles FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY public_read_comments ON public.comments FOR SELECT TO anon, authenticated USING (is_approved = true);
CREATE POLICY admin_read_comments ON public.comments FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY admin_update_comments ON public.comments FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY admin_delete_comments ON public.comments FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY public_subscribe_newsletter ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY admin_read_newsletter ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY admin_update_newsletter ON public.newsletter_subscribers FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY admin_delete_newsletter ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.is_admin());
