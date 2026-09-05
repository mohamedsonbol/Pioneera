# Supabase production-security migration gate

This runbook applies only `20260904000000_harden_legacy_access.sql`. Do not run it until the release owner approves the maintenance window and confirms that the live application is using the Phase 1 code.

## What the migration changes

It changes RLS policies and adds `public.is_admin()`. It does not run `DELETE`, `UPDATE`, `TRUNCATE`, `ALTER TABLE`, or any data migration. Published article reading remains available to `anon` and `authenticated`; approved-comment reading remains available. Anonymous comment insertion is removed. Article mutations, comment moderation, and newsletter administration require the signed JWT claim `app_metadata.role = 'admin'`.

`app_metadata` is only assignable through trusted Supabase administrative tooling, not normal browser user-update APIs. The function reads the caller's signed JWT and does not grant a role.

## Backup and pre-migration checks

1. Schedule a maintenance window and record the production project ref and current migration list.
2. Create a database backup in the Supabase dashboard, then export a second recoverable copy:

   ```bash
   pg_dump --format=custom --no-owner --no-privileges "$SUPABASE_DB_URL" > pioneera-pre-rls-hardening.dump
   ```

3. Confirm the migration has not already been applied:

   ```bash
   supabase migration list --db-url "$SUPABASE_DB_URL"
   ```

4. Confirm at least one trusted administrator can be assigned `app_metadata.role = admin`, and set `ADMIN_EMAILS` in the website environment before deployment.
5. Capture the current policies and row counts:

   ```sql
   select tablename, policyname, cmd, roles, qual, with_check
   from pg_policies
   where schemaname = 'public' and tablename in ('articles', 'comments', 'newsletter_subscribers')
   order by tablename, policyname;

   select 'articles' as table_name, count(*) from public.articles
   union all select 'comments', count(*) from public.comments
   union all select 'newsletter_subscribers', count(*) from public.newsletter_subscribers;
   ```

## Exact application command

From this repository, with the production database URL supplied only through the shell environment:

```bash
supabase db push --db-url "$SUPABASE_DB_URL"
```

Do not paste credentials into a command history, source file, or ticket. The command applies all unapplied repository migrations, so compare `supabase migration list` output with the approved change set first.

## Post-migration verification

Run the policy query from the pre-check again. It must show `public_read_articles`, no `public_insert_comments`, and admin policies whose expressions call `public.is_admin()`.

```sql
select public.is_admin() as current_session_is_admin;
select count(*) from public.articles where is_published = true;
```

Use separate browser sessions or API requests for each smoke test:

1. Anonymous visitor can list and open published articles.
2. Anonymous visitor cannot insert a comment; the API returns an RLS authorization failure.
3. Normal verified member cannot create, update, or delete articles; cannot approve/delete comments; cannot read newsletter subscribers.
4. Trusted admin with `app_metadata.role = admin` and an `ADMIN_EMAILS` allowlist entry can access `/admin` and perform legacy admin mutations.
5. A normal user updating `user_metadata` cannot become an admin. Verify their JWT has no `app_metadata.role = admin` claim.
6. Newsletter opt-in continues to insert a subscriber, and existing row counts are unchanged except for intentional new opt-ins.

## Rollback

The migration is reversible at the policy level and does not require data restoration. Only use rollback for an approved incident; it deliberately restores the prior, insecure authorization behavior.

```sql
drop policy if exists "admin_insert_articles" on public.articles;
drop policy if exists "admin_update_articles" on public.articles;
drop policy if exists "admin_delete_articles" on public.articles;
create policy "admin_insert_articles" on public.articles for insert to authenticated with check (true);
create policy "admin_update_articles" on public.articles for update to authenticated using (true) with check (true);
create policy "admin_delete_articles" on public.articles for delete to authenticated using (true);

drop policy if exists "admin_update_comments" on public.comments;
drop policy if exists "admin_delete_comments" on public.comments;
create policy "public_insert_comments" on public.comments for insert to anon, authenticated with check (true);
create policy "admin_update_comments" on public.comments for update to authenticated using (true) with check (true);
create policy "admin_delete_comments" on public.comments for delete to authenticated using (true);

drop policy if exists "admin_read_newsletter" on public.newsletter_subscribers;
drop policy if exists "admin_delete_newsletter" on public.newsletter_subscribers;
create policy "admin_read_newsletter" on public.newsletter_subscribers for select to authenticated using (true);
create policy "admin_delete_newsletter" on public.newsletter_subscribers for delete to authenticated using (true);
drop function if exists public.is_admin();
```

Immediately schedule a corrective hardening deployment after any rollback.
