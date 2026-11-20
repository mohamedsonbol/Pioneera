import { Mail } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="bg-gradient-to-l from-brand-600 to-brand-800 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-right">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
            <Mail className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">
              النشرة البريدية
            </h2>
            <p className="mt-1 text-sm text-brand-100">
              الاشتراك في النشرة البريدية غير متاح حالياً.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
