import '../styles/index.scss';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CheckoutProvider } from '@/contexts/CheckoutContext/CheckoutContext';
import RootLayout from '@/layout/RootLayout/RootLayout';
import { ToastProvider } from '@/contexts/ToastContext/NotificationContext';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <GlobalProvider>
      <ToastProvider>
        <CheckoutProvider>
          <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
        </CheckoutProvider>
      </ToastProvider>
    </GlobalProvider>
  );
}

export default MyApp;
