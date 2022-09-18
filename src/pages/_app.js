import '../styles/globals.scss';
import Layout from '@/components/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useEffect, useState } from 'react';
import { getShopInfo, getCollections } from '@/lib/shopify/shop';

function MyApp({ Component, pageProps }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getCollections().then((response) => setCollections(response));
    getShopInfo();
  }, []);

  return (
    <UserProvider>
      <GlobalProvider>
        <CartProvider>
          <Layout collections={collections}>
            <Component {...pageProps} />
          </Layout>
        </CartProvider>
      </GlobalProvider>
    </UserProvider>
  );
}

export default MyApp;

/* export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // console.log(metric);
  }
} */
