import '../styles/globals.scss';
import Layout from '@/layout/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useEffect, useState } from 'react';
import { getCollections } from '@/lib/shopify/collection/collectionApiCall';
import Client from 'shopify-buy';

function MyApp({ Component, pageProps }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getCollections(50).then((response) => setCollections(response));
  }, []);

  const config = {
    storefrontAccessToken:
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
    domain: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN,
  };

  const client = Client.buildClient(config);

  return (
    <UserProvider>
      <GlobalProvider>
        <CartProvider client={client}>
          <Layout collections={collections}>
            <Component {...pageProps} />
          </Layout>
        </CartProvider>
      </GlobalProvider>
    </UserProvider>
  );
}

export default MyApp;
