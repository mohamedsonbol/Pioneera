import type { Metadata } from 'next';
import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/tajawal/900.css';
import '@fontsource/amiri/400.css';
import '@fontsource/amiri/700.css';
import { AuthProvider } from '@/lib/auth';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Pioneera.net | مجلة المرأة العصرية',
    template: '%s | Pioneera.net',
  },
  description:
    'مجلة الأسرة العصرية تعنى بدعم الشباب وتمكين المرأة وأسلوب الحياة. مصدرك الأول للأزياء والجمال والصحة والعناية بالأسرة.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'Pioneera.net',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
