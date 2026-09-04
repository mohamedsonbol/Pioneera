'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

const copy: Record<Mode, { title: string; submit: string }> = {
  login: { title: 'تسجيل الدخول', submit: 'تسجيل الدخول' },
  register: { title: 'إنشاء حساب', submit: 'إنشاء حساب مجاني' },
  forgot: { title: 'استعادة كلمة المرور', submit: 'إرسال رابط الاستعادة' },
  reset: { title: 'تعيين كلمة مرور جديدة', submit: 'حفظ كلمة المرور' },
};

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { signIn, signUp, resetPassword, updatePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if ((mode === 'register' || mode === 'reset') && password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }
    setLoading(true);
    setError(null);
    let result: { error: string | null };
    if (mode === 'login') result = await signIn(email, password);
    else if (mode === 'register') result = await signUp(email, password);
    else if (mode === 'forgot') result = await resetPassword(email);
    else result = await updatePassword(password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (mode === 'login' || mode === 'reset') router.replace('/account');
    else if (mode === 'register') setMessage('تحققي من بريدك الإلكتروني لتأكيد الحساب، ثم سجّلي الدخول.');
    else setMessage('إذا كان البريد مسجلاً، أرسلنا رابط استعادة كلمة المرور إليه.');
  };

  const needsEmail = mode !== 'reset';
  const needsPassword = mode !== 'forgot';
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-2xl bg-white p-7 shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-ink-800">{copy[mode].title}</h1>
        {mode === 'register' && <p className="mt-2 text-sm text-ink-500">العضوية مجانية. موافقة النشرة البريدية اختيارية ومنفصلة.</p>}
        <form onSubmit={submit} className="mt-7 space-y-4">
          {needsEmail && <label className="block text-sm font-bold text-ink-700">البريد الإلكتروني<input dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-brand-500" /></label>}
          {needsPassword && <label className="block text-sm font-bold text-ink-700">كلمة المرور<input dir="ltr" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-brand-500" /></label>}
          {(mode === 'register' || mode === 'reset') && <label className="block text-sm font-bold text-ink-700">تأكيد كلمة المرور<input dir="ltr" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className="mt-1.5 w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-brand-500" /></label>}
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
          <button disabled={loading} className="w-full rounded-lg bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-50">{loading ? 'جاري المعالجة...' : copy[mode].submit}</button>
        </form>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-brand-700">
          {mode === 'login' && <><Link href="/register">إنشاء حساب</Link><Link href="/forgot-password">نسيت كلمة المرور؟</Link></>}
          {mode === 'register' && <Link href="/login">لديك حساب؟ سجّلي الدخول</Link>}
          {mode === 'forgot' && <Link href="/login">العودة لتسجيل الدخول</Link>}
        </div>
      </section>
    </main>
  );
}
