-- Canonical schema-security assertion. It changes no application schema.
DO $$
DECLARE policy_count integer; function_definition text;
BEGIN
  IF to_regclass('public.articles') IS NULL OR to_regclass('public.comments') IS NULL OR to_regclass('public.newsletter_subscribers') IS NULL
     OR to_regprocedure('public.is_admin()') IS NULL OR to_regprocedure('public.pioneera_set_updated_at()') IS NULL THEN
    RAISE EXCEPTION 'required Pioneera tables or functions are missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='articles_published_created_at_idx')
     OR NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='comments_article_approved_created_at_idx')
     OR NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='newsletter_subscribers_email_lower_key') THEN
    RAISE EXCEPTION 'required Pioneera indexes are missing';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('articles','comments','newsletter_subscribers') AND NOT c.relrowsecurity) THEN
    RAISE EXCEPTION 'RLS is disabled on a protected table';
  END IF;
  SELECT pg_get_functiondef('public.is_admin()'::regprocedure) INTO function_definition;
  IF function_definition !~ 'app_metadata' OR function_definition ~ 'user_metadata' THEN
    RAISE EXCEPTION 'admin authorization does not use trusted app_metadata only';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='comments' AND cmd='INSERT' AND roles && ARRAY['anon','authenticated']::name[]) THEN
    RAISE EXCEPTION 'anonymous or ordinary authenticated comment insertion remains permitted';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='articles' AND cmd IN ('INSERT','UPDATE','DELETE') AND (qual IS NULL OR qual !~ 'is_admin') AND (with_check IS NULL OR with_check !~ 'is_admin')) THEN
    RAISE EXCEPTION 'non-admin article mutation remains permitted';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='newsletter_subscribers' AND cmd='SELECT' AND (qual IS NULL OR qual !~ 'is_admin')) THEN
    RAISE EXCEPTION 'public newsletter subscriber reads remain permitted';
  END IF;
  SELECT count(*) INTO policy_count FROM pg_policies WHERE schemaname='public' AND policyname IN ('public_read_articles','public_read_comments','public_subscribe_newsletter','admin_insert_articles','admin_update_articles','admin_delete_articles','admin_update_comments','admin_delete_comments','admin_read_newsletter','admin_delete_newsletter');
  IF policy_count <> 10 THEN RAISE EXCEPTION 'required hardened policies are absent'; END IF;
END;
$$;
