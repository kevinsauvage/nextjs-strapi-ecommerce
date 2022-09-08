import '../styles/globals.scss';
import App from 'next/app';
import { NextIntlProvider } from 'next-intl';
import nookies from 'nookies';
import Layout from '@/components/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { getShopifyClient } from '@/lib/shopify/index';

function MyApp({ Component, pageProps }) {
  const { messages, collections, user, token, path } = pageProps;

  console.log(
    messages,
    'messages translated messages translated messages translated messages translated APP.js'
  );
  console.log('path :', path);
  return (
    <NextIntlProvider messages={messages}>
      <GlobalProvider>
        <UserProvider token={token}>
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

  console.log(ctx);
  const collections = await getShopifyClient(locale)?.collection?.fetchAll();
  const policies = await getShopifyClient(locale)?.shop?.fetchPolicies();
  const shopInfos = await getShopifyClient(locale)?.shop?.fetchInfo();
  const cookies = nookies.get(ctx.ctx);

  return {
    ...appProps,
    pageProps: {
      collections,
      policies,
      shopInfos,
      token: cookies?.shopify_token,
      messages: (await import(`../locales/${locale}.json`)).default,
      path: ctx.ctx.pathname,
    },
  };
};

export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // console.log(metric);
  }
}
