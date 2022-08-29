import 'nextjs-breadcrumbs/dist/index.css';
import '../styles/globals.scss';
import App from 'next/app';
import { NextIntlProvider } from 'next-intl';
import apiCall from '../utils/apiStrapi';
import Layout from '../components/Layout/Layout';
import { GlobalProvider } from '../contexts/GlobalContext/GlobalContext';
import { CartProvider } from '../contexts/CartContext/CartContext';
import { UserProvider } from '../contexts/UserContext/UserContext';
import { getShopifyClient } from '../lib/shopify';

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

  const userToken = ctx?.ctx?.req?.cookies?.jwt;

  const collections = await getShopifyClient(locale).collection.fetchAll();
  const policies = await getShopifyClient(locale).shop.fetchPolicies();
  const shopInfos = await getShopifyClient(locale).shop.fetchInfo();
  let user = null;

  if (userToken) {
    try {
      const response = await apiCall.user.getMe(userToken);
      user = response;
    } catch (e) {
      console.log('error get user me : Initial props _App');
      console.log(e);
    }
  }

  return {
    ...appProps,
    pageProps: { collections, user, policies, shopInfos },
  };
};

export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // console.log(metric);
  }
}
