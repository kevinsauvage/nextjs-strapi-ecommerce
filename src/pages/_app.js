import '../styles/globals.scss';
import '../styles/colors.scss';
import '../styles/typography.scss';
import '../styles/spacing.scss';
import Layout from '@/layout/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useEffect, useState } from 'react';
import { getCollections } from '@/lib/shopify/collection/collectionApiCall';
import { ProductProvider } from '@/contexts/ProductContext/ProductContext';

function MyApp({ Component, pageProps }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getCollections(50).then((response) => setCollections(response));
  }, []);

  return (
    <UserProvider>
      <GlobalProvider>
        <ProductProvider>
          <CartProvider>
            <Layout collections={collections}>
              <Component {...pageProps} />
            </Layout>
          </CartProvider>
        </ProductProvider>
      </GlobalProvider>
    </UserProvider>
  );
}

export default MyApp;
