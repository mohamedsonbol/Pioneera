import Image from 'next/image';
import Link from 'next/link';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { categories } from '@/lib/types';

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="inline-block rounded-md bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">
              <Image
                src="/IMG-20260828-WA0007.jpg"
                alt="Pioneera logo"
                width={1536}
                height={1024}
                sizes="224px"
                className="h-auto w-56"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              مجلة الأسرة العصرية تعنى بدعم الشباب وتمكين المرأة وأسلوب الحياة. مصدرك الأول
              للأزياء والجمال والصحة والعناية بالأسرة.
            </p>
            <p className="mt-4 text-xs font-medium text-ink-300">Part of Visions Group</p>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">الأقسام</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-ink-300">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.id}`} className="transition-colors hover:text-brand-400">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">تواصل معنا</h4>
            <ul className="flex flex-col gap-3 text-sm text-ink-300">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                <span>مصر (Egypt)</span>
              </li>
              <li>
                <a href="tel:+971556889166" dir="ltr" className="flex w-fit items-center gap-2 transition-colors hover:text-brand-400">
                  <Phone className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  <span>+971 55 688 9166</span>
                </a>
              </li>
              <li>
                <a href="tel:00201032907200" dir="ltr" className="flex w-fit items-center gap-2 transition-colors hover:text-brand-400">
                  <Phone className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  <span>00201032907200</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/971556889166" target="_blank" rel="noreferrer" className="flex w-fit items-center gap-2 transition-colors hover:text-brand-400">
                  <MessageCircle className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  <span>واتساب</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-ink-400">
          © ٢٠٢٦ Pioneera. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
