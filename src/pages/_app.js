import '../styles/index.scss';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { CheckoutProvider } from '@/contexts/CheckoutContext/CheckoutContext';
import RootLayout from '@/layout/RootLayout/RootLayout';

function MyApp({ Component, pageProps, router }) {
  return (
    <GlobalProvider>
      <CheckoutProvider>
        <RootLayout>
          {router.pathname.startsWith('/account') ? (
            <UserProvider>
              <Component {...pageProps} />
            </UserProvider>
          ) : (
            <Component {...pageProps} />
          )}
        </RootLayout>
      </CheckoutProvider>
    </GlobalProvider>
  );
}

export default MyApp;
