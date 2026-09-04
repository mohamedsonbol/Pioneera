import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isConfiguredAdmin } from '@/lib/admin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isConfiguredAdmin(user)) notFound();
  return <AdminDashboard />;
}
