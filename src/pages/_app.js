import '../styles/globals.scss';
import { NextIntlProvider } from 'next-intl';
import Layout from '@/components/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getShopInfo, getCollections } from '@/lib/shopify/shop';

import fr from '../locales/fr.json';
import es from '../locales/es.json';
import en from '../locales/en.json';

const messages = {
  en,
  es,
  fr,
};

function MyApp({ Component, pageProps }) {
  const [collections, setCollections] = useState([]);
  const { locale } = useRouter();

  useEffect(() => {
    getCollections().then((response) => setCollections(response));
    getShopInfo();
  }, []);

  return (
    <NextIntlProvider messages={messages[locale]}>
      <UserProvider>
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

/* export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // console.log(metric);
  }
} */
