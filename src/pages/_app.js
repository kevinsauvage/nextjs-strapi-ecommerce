import App from 'next/app';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CheckoutProvider } from '@/contexts/CheckoutContext/CheckoutContext';
import RootLayout from '@/layout/RootLayout/RootLayout';
import { ToastProvider } from '@/contexts/ToastContext/NotificationContext';
import { getMenuHeader } from '@/lib/shopify/shop/shopApiCall';
import '../styles/index.scss';

function MyApp({ Component, pageProps, headerMenu }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <GlobalProvider>
      <ToastProvider>
        <CheckoutProvider>
          <RootLayout headerMenu={headerMenu}>{getLayout(<Component {...pageProps} />)}</RootLayout>
        </CheckoutProvider>
      </ToastProvider>
    </GlobalProvider>
  );
}
MyApp.getInitialProps = async (appContext) => {
  const pageProps = App.getInitialProps(appContext);
  const headerMenu = await getMenuHeader();
  return { ...pageProps, headerMenu };
};

export default MyApp;
