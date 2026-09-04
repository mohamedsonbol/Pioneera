import { redirect } from 'next/navigation';
import AccountPanel from '@/components/AccountPanel';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'حسابي' };
export default async function AccountPage() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user || !user.email) redirect('/login'); return <AccountPanel email={user.email} verified={Boolean(user.email_confirmed_at)} />; }
