import '../styles/index.scss';
import Layout from '@/layout/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { CheckoutProvider } from '@/contexts/CheckoutContext/CheckoutContext';

function MyApp({ Component, pageProps, router }) {
  return (
    <GlobalProvider>
      <CheckoutProvider>
        <Layout>
          {router.pathname.startsWith('/account') ? (
            <UserProvider>
              <Component {...pageProps} />
            </UserProvider>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </CheckoutProvider>
    </GlobalProvider>
  );
}

export default MyApp;
