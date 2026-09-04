import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50">
      <p className="text-ink-500">الصفحة غير موجودة</p>
      <Link
        href="/"
        className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
