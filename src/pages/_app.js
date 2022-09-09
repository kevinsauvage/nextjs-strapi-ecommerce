import '../styles/globals.scss';
import App from 'next/app';
import { NextIntlProvider } from 'next-intl';
import nookies from 'nookies';
import Layout from '@/components/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { getShopifyClient } from '@/lib/shopify/index';

function MyApp({ Component, pageProps, messages, token, collections }) {
  return (
    <NextIntlProvider messages={messages}>
      <UserProvider token={token}>
        <GlobalProvider>
          <CartProvider>
            <Layout collections={collections}>
              <Component {...pageProps} />
            </Layout>
          </CartProvider>
        </GlobalProvider>
      </UserProvider>
    </NextIntlProvider>
  );
}

export default MyApp;

MyApp.getInitialProps = async (ctx) => {
  const appProps = await App.getInitialProps(ctx);
  const { locale } = ctx.router;

  const collections = await getShopifyClient(locale)?.collection?.fetchAll();
  const cookies = nookies.get(ctx.ctx);

  const shopifyToken = cookies?.shopify_token;

  console.log(cookies, 'cookies getInitialProps');

  return {
    ...appProps,
    collections,
    token: shopifyToken,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
};

/* export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // console.log(metric);
  }
} */
