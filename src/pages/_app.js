import Head from 'next/head';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CheckoutProvider } from '@/contexts/CheckoutContext/CheckoutContext';
import RootLayout from '@/layout/RootLayout/RootLayout';
import { ToastProvider } from '@/contexts/ToastContext/NotificationContext';
import config from '@/config/index';
import '../styles/index.scss';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const siteTitle = `${config.name} | Home page`;

  return (
    <GlobalProvider>
      <ToastProvider>
        <CheckoutProvider>
          <Head>
            <title>{siteTitle}</title>
          </Head>
          <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
        </CheckoutProvider>
      </ToastProvider>
    </GlobalProvider>
  );
}

export default MyApp;
