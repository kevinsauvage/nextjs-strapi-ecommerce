import '../styles/globals.scss';
import '../styles/colors.scss';
import '../styles/typography.scss';
import '../styles/spacing.scss';
import '../styles/elevation.scss';
import App from 'next/app';
import { useEffect } from 'react';
import Layout from '@/layout/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { ProductProvider } from '@/contexts/ProductContext/ProductContext';
import { getMenuFooter, getMenuHeader } from '@/lib/shopify/shop/shopApiCall';

function MyApp({ Component, pageProps, headerMenu }) {
  useEffect(() => {});
  return (
    <UserProvider>
      <GlobalProvider>
        <ProductProvider>
          <CartProvider>
            <Layout headerMenu={headerMenu}>
              <Component {...pageProps} />
            </Layout>
          </CartProvider>
        </ProductProvider>
      </GlobalProvider>
    </UserProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const headerMenu = await getMenuHeader();
  const footerMenu = await getMenuFooter();
  return { ...appProps, headerMenu, footerMenu };
};
export default MyApp;
