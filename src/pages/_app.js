import Head from 'next/head';
import RootLayout from '@/layout/RootLayout/RootLayout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { ToastProvider } from '@/contexts/ToastContext/NotificationContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import config from '@/config/index';
import '../styles/index.scss';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const siteTitle = `${config.name} | Home page`;

  return (
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
  );
}

export default MyApp;
