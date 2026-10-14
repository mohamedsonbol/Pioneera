import { redirect } from 'next/navigation';

export default async function AdminPage() {
  redirect('https://cms.pioneera.net/wp-admin');
}
