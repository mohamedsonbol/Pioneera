import Link from 'next/link';

const WORDPRESS_ADMIN_URL = 'https://cms.pioneera.net/wp-admin';

export default function MembershipNotice({ title }: { title: string }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-2xl bg-white p-7 shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-ink-800">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          خدمات العضوية والتسجيل متاحة الآن عبر موقع WordPress. سجّلي الدخول من هناك لإدارة حسابك.
        </p>
        <a
          href={WORDPRESS_ADMIN_URL}
          className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          الانتقال إلى WordPress
        </a>
        <div className="mt-5 text-sm">
          <Link href="/" className="font-bold text-brand-700">العودة إلى الرئيسية</Link>
        </div>
      </section>
    </main>
  );
}
