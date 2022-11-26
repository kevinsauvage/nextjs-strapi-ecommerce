import '../styles/globals.scss';
import '../styles/colors.scss';
import '../styles/typography.scss';
import '../styles/spacing.scss';
import '../styles/elevation.scss';
import Layout from '@/layout/Layout/Layout';
import { GlobalProvider } from '@/contexts/GlobalContext/GlobalContext';
import { CartProvider } from '@/contexts/CartContext/CartContext';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { ProductProvider } from '@/contexts/ProductContext/ProductContext';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <GlobalProvider>
        <ProductProvider>
          <CartProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CartProvider>
        </ProductProvider>
      </GlobalProvider>
    </UserProvider>
  );
}

export default MyApp;
