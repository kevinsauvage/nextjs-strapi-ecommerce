import '../styles/globals.scss';
import App from 'next/app';
import { NextIntlProvider } from 'next-intl';
import apiCall from '../utils/apiStrapi';
import Layout from '../components/Layout/Layout';
import { GlobalProvider } from '../contexts/GlobalContext/GlobalContext';
import { CartProvider } from '../contexts/CartContext/CartContext';
import { UserProvider } from '../contexts/UserContext/UserContext';

function MyApp({ Component, pageProps }) {
  const { messages, categories, user } = pageProps;

  return (
    <NextIntlProvider messages={messages}>
      <GlobalProvider>
        <UserProvider>
          <CartProvider>
            <Layout categories={categories} user={user}>
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

  const categories = await apiCall.category.getCategories(locale);

  let user = null;

  console.log(userToken);
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
    pageProps: { categories, user },
  };
};

export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // console.log(metric);
  }
}
