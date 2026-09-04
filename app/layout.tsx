import type { Metadata } from 'next';
import { Tajawal, Amiri } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import './globals.css';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-tajawal',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

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
      <body className={`${tajawal.variable} ${amiri.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
