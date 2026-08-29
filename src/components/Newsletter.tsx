import { Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/queries';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    const { error } = await subscribeNewsletter(email.trim());
    setLoading(false);
    if (error) {
      if (error.includes('duplicate') || error.includes('unique')) {
        setError('هذا البريد مشترك بالفعل');
      } else {
        setError('فشل الاشتراك: ' + error);
      }
    } else {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="bg-gradient-to-l from-brand-600 to-brand-800 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-right">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
            <Mail className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">
              اشتركي في النشرة البريدية
            </h2>
            <p className="mt-1 text-sm text-brand-100">
              احصلي على أحدث المقالات والعروض الحصرية مباشرة في بريدك الإلكتروني
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              required
              dir="ltr"
              className="flex-1 rounded-full border-0 px-5 py-3 text-sm text-ink-800 outline-none ring-2 ring-transparent focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex flex-shrink-0 items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-ink-800 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {loading ? '...' : 'اشتراك'}
            </button>
          </form>
        </div>
        {submitted && (
          <p className="mt-4 text-center text-sm text-white animate-fadeIn">
            تم اشتراكك بنجاح! شكراً لك.
          </p>
        )}
        {error && (
          <p className="mt-4 text-center text-sm text-accent-100">{error}</p>
        )}
      </div>
    </section>
  );
}
