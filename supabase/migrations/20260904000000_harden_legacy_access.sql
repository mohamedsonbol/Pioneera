-- Phase 1 safety hardening. Apply with the Supabase migration workflow; this file
-- does not contact or alter a remote project by itself.
-- Admin accounts must be assigned `app_metadata.role = 'admin'` using a trusted
-- server or the Supabase dashboard. Never let a browser set app_metadata.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

DROP POLICY IF EXISTS "admin_insert_articles" ON public.articles;
DROP POLICY IF EXISTS "admin_update_articles" ON public.articles;
DROP POLICY IF EXISTS "admin_delete_articles" ON public.articles;
CREATE POLICY "admin_insert_articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_update_articles" ON public.articles FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_articles" ON public.articles FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_insert_comments" ON public.comments;
DROP POLICY IF EXISTS "admin_update_comments" ON public.comments;
DROP POLICY IF EXISTS "admin_delete_comments" ON public.comments;
CREATE POLICY "admin_update_comments" ON public.comments FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_comments" ON public.comments FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admin_read_newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "admin_delete_newsletter" ON public.newsletter_subscribers;
CREATE POLICY "admin_read_newsletter" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_delete_newsletter" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.is_admin());
