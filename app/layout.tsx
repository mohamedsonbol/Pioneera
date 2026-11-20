import type { Metadata } from 'next';
import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/tajawal/900.css';
import '@fontsource/amiri/400.css';
import '@fontsource/amiri/700.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Pioneera | مجلة المرأة العصرية',
    template: '%s | Pioneera',
  },
  description:
    'مجلة الأسرة العصرية تعنى بدعم الشباب وتمكين المرأة وأسلوب الحياة. مصدرك الأول للأزياء والجمال والصحة والعناية بالأسرة.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: 'Pioneera',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Pioneera',
    parentOrganization: {
      '@type': 'Organization',
      name: 'Visions Group',
    },
    areaServed: 'EG',
    telephone: '+971 55 688 9166',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+971 55 688 9166',
        contactType: 'customer service',
      },
      {
        '@type': 'ContactPoint',
        telephone: '00201032907200',
        contactType: 'customer service',
      },
    ],
  };

  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
