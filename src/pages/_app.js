import '../styles/globals.scss';
import '../styles/colors.scss';
import '../styles/typography.scss';
import '../styles/spacing.scss';
import '../styles/elevation.scss';
import Layout from '@/layout/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { CheckoutProvider } from '@/contexts/CheckoutContext/CheckoutContext';

function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <UserProvider>
        <CheckoutProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CheckoutProvider>
      </UserProvider>
    </GlobalProvider>
  );
}

export default MyApp;
