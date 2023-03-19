import Head from 'next/head';
import Script from 'next/script';

import config from '@/config/index';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { ToastProvider } from '@/contexts/ToastContext/NotificationContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import RootLayout from '@/layout/RootLayout/RootLayout';

import '../styles/index.scss';

const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);
  const siteTitle = `${config.name} | Home page`;

  return (
    <>
      <Script
        id="gtag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];

          function gtag(){dataLayer.push(arguments);}

          gtag('consent', 'default', {
            ad_storage: false,
            analytics_storage: false,
            functionality_storage: true,
            personalization_storage: false,
          });
          
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');`,
        }}
      />
      <GlobalProvider>
        <ToastProvider>
          <CartProvider>
            <UserProvider>
              <Head>
                <title>{siteTitle}</title>
              </Head>
              <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
            </UserProvider>
          </CartProvider>
        </ToastProvider>
      </GlobalProvider>
    </>
  );
};

export default MyApp;
