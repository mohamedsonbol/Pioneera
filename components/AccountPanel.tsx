'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function AccountPanel({ email, verified }: { email: string; verified: boolean }) {
  const router = useRouter();
  const { signOut } = useAuth();
  return (
    <main className="mx-auto min-h-[60vh] max-w-2xl px-4 py-12">
      <section className="rounded-2xl bg-white p-7 shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-ink-800">حسابي</h1>
        <dl className="mt-7 space-y-4 text-sm">
          <div className="flex justify-between gap-4 border-b border-ink-100 pb-3"><dt className="text-ink-500">البريد الإلكتروني</dt><dd dir="ltr" className="font-medium text-ink-800">{email}</dd></div>
          <div className="flex justify-between gap-4 border-b border-ink-100 pb-3"><dt className="text-ink-500">حالة العضوية</dt><dd className="font-bold text-emerald-600">عضوية مجانية</dd></div>
          <div className="flex justify-between gap-4 border-b border-ink-100 pb-3"><dt className="text-ink-500">تأكيد البريد</dt><dd className={verified ? 'font-bold text-emerald-600' : 'font-bold text-accent-700'}>{verified ? 'تم التأكيد' : 'بانتظار التأكيد'}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-500">النشرة البريدية</dt><dd className="text-ink-700">اختيار مستقل عن العضوية</dd></div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/forgot-password" className="rounded-lg border border-brand-200 px-4 py-2.5 text-sm font-bold text-brand-700">تغيير كلمة المرور</Link>
          <button onClick={async () => { await signOut(); router.replace('/'); }} className="rounded-lg bg-ink-800 px-4 py-2.5 text-sm font-bold text-white">تسجيل الخروج</button>
        </div>
      </section>
    </main>
  );
}
