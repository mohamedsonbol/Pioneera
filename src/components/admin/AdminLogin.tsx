import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Lock, Mail, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onBack: () => void;
}

export default function AdminLogin({ onBack }: AdminLoginProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fn = mode === 'login' ? signIn : signUp;
    const { error } = await fn(email, password);

    if (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900 px-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-ink-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة للموقع
        </button>

        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <img
              src="/IMG-20260828-WA0007.jpg"
              alt="Pioneera.net"
              className="mx-auto h-16 w-auto object-contain"
            />
            <h1 className="mt-4 font-serif text-2xl font-bold text-ink-800">
              {mode === 'login' ? 'تسجيل دخول المشرف' : 'إنشاء حساب المشرف'}
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {mode === 'login'
                ? 'ادخل بياناتك للوصول إلى لوحة التحكم'
                : 'أنشئ حساب المشرف الأول للموقع'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-ink-200 bg-ink-50 py-3 pr-10 pl-4 text-sm outline-none focus:border-brand-400 focus:bg-white"
                  placeholder="admin@pioneera.net"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-ink-200 bg-ink-50 py-3 pr-10 pl-4 text-sm outline-none focus:border-brand-400 focus:bg-white"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-600 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {loading
                ? 'جاري المعالجة...'
                : mode === 'login'
                  ? 'تسجيل الدخول'
                  : 'إنشاء الحساب'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-ink-500">
            {mode === 'login' ? (
              <>
                ليس لديك حساب؟{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="font-bold text-brand-600 hover:underline"
                >
                  إنشاء حساب
                </button>
              </>
            ) : (
              <>
                لديك حساب بالفعل؟{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-bold text-brand-600 hover:underline"
                >
                  تسجيل الدخول
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
