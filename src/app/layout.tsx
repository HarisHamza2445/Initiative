import type { Metadata } from 'next';
import './globals.css';
import { getSite } from '@/lib/content';
import { SiteProvider } from '@/lib/site-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LegacyHashRedirect } from '@/components/layout/LegacyHashRedirect';
import { MotionRoot } from '@/components/layout/MotionRoot';

export const metadata: Metadata = {
  title: { default: 'The Shubmaan Initiative – Together, we can make a difference', template: '%s · The Shubmaan Initiative' },
  icons: { icon: '/img/favicon.png' }
};

const GS_WAIT = "if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('gs-wait');setTimeout(function(){document.documentElement.classList.remove('gs-wait')},3000)}";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Cinzel:wght@600;700&family=Allura&family=Caveat:wght@600&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: GS_WAIT }} />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <SiteProvider value={site}>
          <MotionRoot>
            <LegacyHashRedirect />
            <Header />
            {children}
            <Footer />
          </MotionRoot>
        </SiteProvider>
      </body>
    </html>
  );
}
