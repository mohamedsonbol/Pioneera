import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { categories } from '@/data/articles';

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <img
              src="/IMG-20260828-WA0007.jpg"
              alt="Pioneera.net - مجلة المرأة"
              className="h-16 w-auto max-w-[220px] object-contain"
            />
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              مجلة الأسرة العصرية تعنى بدعم الشباب وتمكين المرأة وأسلوب الحياة. مصدرك الأول
              للأزياء والجمال والصحة والعناية بالأسرة.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" className="rounded-full bg-ink-800 p-2 text-ink-300 transition-colors hover:bg-brand-600 hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-ink-800 p-2 text-ink-300 transition-colors hover:bg-brand-600 hover:text-white">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-ink-800 p-2 text-ink-300 transition-colors hover:bg-brand-600 hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-ink-800 p-2 text-ink-300 transition-colors hover:bg-brand-600 hover:text-white">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 font-bold text-white">الأقسام</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-ink-300">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a href="#" className="transition-colors hover:text-brand-400">
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-bold text-white">روابط سريعة</h4>
            <ul className="flex flex-col gap-2 text-sm text-ink-300">
              <li><a href="#" className="transition-colors hover:text-brand-400">من نحن</a></li>
              <li><a href="#" className="transition-colors hover:text-brand-400">سياسة الخصوصية</a></li>
              <li><a href="#" className="transition-colors hover:text-brand-400">شروط الاستخدام</a></li>
              <li><a href="#" className="transition-colors hover:text-brand-400">الإعلان معنا</a></li>
              <li><a href="#" className="transition-colors hover:text-brand-400">اتصل بنا</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-bold text-white">تواصل معنا</h4>
            <ul className="flex flex-col gap-3 text-sm text-ink-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-400" />
                <span>info@pioneera.net</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-400" />
                <span dir="ltr">+966 12 345 6789</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-400" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-800">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-ink-400">
          © ٢٠٢٦ Pioneera.net. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
