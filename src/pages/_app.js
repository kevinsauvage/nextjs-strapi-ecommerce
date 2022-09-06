import '../styles/globals.scss';
import App from 'next/app';
import { NextIntlProvider } from 'next-intl';
import nookies from 'nookies';
import Layout from '@/components/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { getShopifyClient } from '@/lib/shopify';

function MyApp({ Component, pageProps }) {
  const { messages, collections, user } = pageProps;

  return (
    <NextIntlProvider messages={messages}>
      <GlobalProvider>
        <UserProvider>
          <CartProvider>
            <Layout collections={collections} user={user}>
              <Component {...pageProps} />
            </Layout>
          </CartProvider>
        </UserProvider>
      </GlobalProvider>
    </NextIntlProvider>
  );
}

export default MyApp;

MyApp.getInitialProps = async (ctx) => {
  const appProps = await App.getInitialProps(ctx);
  const { locale } = ctx.router;

  const collections = await getShopifyClient(locale)?.collection?.fetchAll();
  const policies = await getShopifyClient(locale)?.shop?.fetchPolicies();
  const shopInfos = await getShopifyClient(locale)?.shop?.fetchInfo();

  const cookies = nookies.get(ctx);
  console.log(cookies, 'cookies');
  return {
    ...appProps,
    pageProps: { collections, policies, shopInfos },
  };
};

export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // console.log(metric);
  }
}
