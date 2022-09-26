import '../styles/globals.scss';
import Layout from '@/components/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useEffect, useState } from 'react';
import { getCollections } from '@/lib/shopify/collection/collectionApiCall';

function MyApp({ Component, pageProps }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getCollections(50).then((response) => setCollections(response));
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
