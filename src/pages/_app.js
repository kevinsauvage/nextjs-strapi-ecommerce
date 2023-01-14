import '../styles/index.scss';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CheckoutProvider } from '@/contexts/CheckoutContext/CheckoutContext';
import RootLayout from '@/layout/RootLayout/RootLayout';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <GlobalProvider>
      <CheckoutProvider>
        <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
      </CheckoutProvider>
    </GlobalProvider>
  );
}

export default MyApp;
