import { redirect } from 'next/navigation';
import AccountPanel from '@/components/AccountPanel';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config.mjs';

export const metadata = { title: 'حسابي' };
export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return <main className="mx-auto max-w-md px-4 py-16 text-center"><h1 className="font-serif text-3xl font-bold text-ink-800">العضوية غير متاحة حالياً</h1><p className="mt-3 text-ink-600">خدمات الحسابات غير مفعلة في الوقت الحالي.</p></main>;
  }
  const supabase = await createClient();
  if (!supabase) redirect('/login');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) redirect('/login');
  return <AccountPanel email={user.email} verified={Boolean(user.email_confirmed_at)} />;
}
