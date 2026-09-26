import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';

import CookieBanner from '@/components/CookieBanner';
import Footer from '@/components/Footer';
import GtmScript from '@/components/GtmScript';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';
import { LocaleProvider } from '@/components/LocaleProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import config from '@/config';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import siteMetadata from '@/data/siteMetadata';
import { loadMessages } from '@/i18n/messages';
import { HTML_LANG, LOCALES, OG_LOCALE } from '@/i18n/routing';
import { contentLanguage, declareLocale, getTranslations, localeFromParams } from '@/i18n/server';
import { getBaseUrl } from '@/lib/server/metadata';
import { getStorefront } from '@/lib/server/storefront';
import { organizationJsonLd, websiteJsonLd } from '@/lib/server/structured-data';

import '../../styles/globals.css';

/**
 * The locale is a route segment, so every language gets its own prerendered
 * shell instead of a per-request render. `src/proxy.ts` rewrites the unprefixed
 * English URLs to `/en/...` internally, which keeps `/collections` and
 * `/collections` the same route while the visitor still sees one stable URL.
 */
export const generateStaticParams = async () => LOCALES.map((locale) => ({ locale }));

/**
 * Generated per locale because `og:locale` follows the resolved language.
 * Everything else is static configuration.
 */
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);

  return {
    metadataBase: new URL(getBaseUrl()),
    title: {
      default: `${siteMetadata.companyName} — Online Store`,
      template: `%s | ${siteMetadata.companyName}`,
    },
    description: siteMetadata.about.short,
    applicationName: siteMetadata.companyName,
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale],
      siteName: siteMetadata.companyName,
      title: siteMetadata.companyName,
      description: siteMetadata.about.short,
      url: '/',
      images: [
        {
          url: siteMetadata.siteLogo,
          width: 1200,
          height: 630,
          alt: siteMetadata.companyName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: siteMetadata.twitterHandle,
      title: siteMetadata.companyName,
      description: siteMetadata.about.short,
      images: [siteMetadata.siteLogo],
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: siteMetadata.siteLogoSquare,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' },
  ],
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: false,
  axes: ['SOFT', 'WONK', 'opsz'],
});

const LocaleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const locale = await localeFromParams(params);

  // Must happen before any `next-intl` API is used, so no request read is needed.
  declareLocale(locale);

  const messages = loadMessages(locale);
  const t = getTranslations(locale, 'common');
  const storefront = await getStorefront(locale);
  const language = contentLanguage(locale);

  const [headerMenu, footerMenu] = await Promise.all([
    storefront.getMenuByHandle({
      handle: config.constants.menuHandles.main,
      language,
    }),
    storefront.getMenuByHandle({
      handle: config.constants.menuHandles.footer,
      language,
    }),
  ]);

  return (
    <html
      lang={HTML_LANG[locale]}
      className={`${inter.variable} ${fraunces.variable} font-sans scroll-smooth antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
      </head>
      <body className="relative bg-background min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleProvider locale={locale}>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg focus:ring-2 focus:ring-ring"
            >
              {t('skipToContent')}
            </a>
            <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
            <GtmScript />
            <CookieBanner />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <CartProvider>
                <UserProvider>
                  <Header headerMenu={headerMenu?.menu || null} locale={locale} />
                  <main id="main" className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]">
                    {children}
                  </main>
                  <Toaster richColors />
                  <Footer locale={locale} menuItems={footerMenu?.menu?.items} />
                </UserProvider>
              </CartProvider>
            </ThemeProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
