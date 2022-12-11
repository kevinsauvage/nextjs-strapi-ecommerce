import '../styles/index.scss';
import Layout from '@/layout/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { CheckoutProvider } from '@/contexts/CheckoutContext/CheckoutContext';

function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <CheckoutProvider>
        <UserProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </CheckoutProvider>
    </GlobalProvider>
  );
}

export default MyApp;
