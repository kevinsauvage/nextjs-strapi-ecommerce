import { CartProvider } from 'src/contexts/CartContext/CartContext';
import { ToastProvider } from 'src/contexts/ToastContext/NotificationContext';
import { UserProvider } from 'src/contexts/UserContext/UserContext';

import { getCartAction } from '@/actions/cartActions';
import { getWishlistAction } from '@/actions/whishlistActions';
import CookieBanner from '@/components/CookieBanner/CookieBanner';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import getClient from '@/shopify';
import { getUser } from '@/utils/users';

import LayoutContainer from './layoutContainer';

import '@/styles/reset.scss';
import '@/styles/globals.scss';
import '@/styles/typography.scss';
import '@/styles/spacing.scss';
import '@/styles/variables.scss';
import '@/styles/themes.scss';

const RootLayout = async ({ children }) => {
  const headerMenu = await getClient().storefront.shop.getMenu({ handle: 'main-menu' });
  const cart = await getCartAction();
  const user = await getUser();
  const userWishlist = await getWishlistAction();

  return (
    <LayoutContainer>
      <CookieBanner />
      <ToastProvider>
        <CartProvider initialCart={cart}>
          <UserProvider user={user} userWishlist={userWishlist}>
            <Header headerMenu={headerMenu.items} />
            {children}
            <Footer />
          </UserProvider>
        </CartProvider>
      </ToastProvider>
    </LayoutContainer>
  );
};

export default RootLayout;
