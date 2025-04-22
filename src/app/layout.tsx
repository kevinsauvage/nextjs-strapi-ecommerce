import { CartProvider } from 'src/contexts/CartContext/CartContext';
import { ToastProvider } from 'src/contexts/ToastContext/NotificationContext';
import { UserProvider } from 'src/contexts/UserContext/UserContext';

import { getCartAction } from '@/actions/cartActions';
import { getWishlistAction } from '@/actions/whishlistActions';
import CookieBanner from '@/components/CookieBanner/CookieBanner';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { storefrontSdk } from '@/shopify';
import type { CartFieldsFragment } from '@/shopify/storefront';
import { getUser } from '@/utils/users';

import LayoutContainer from './LayoutContainer';

import '@/styles/reset.scss';
import '@/styles/globals.scss';
import '@/styles/typography.scss';
import '@/styles/spacing.scss';
import '@/styles/variables.scss';
import '@/styles/themes.scss';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const headerMenu = await storefrontSdk().getMenuByHandle({
    handle: 'main-menu',
  });
  const cart = await getCartAction({});
  const user = await getUser();
  const userWishlist = await getWishlistAction();

  return (
    <LayoutContainer>
      <CookieBanner />
      <ToastProvider>
        <CartProvider initialCart={cart as unknown as CartFieldsFragment}>
          <UserProvider user={user} userWishlist={userWishlist}>
            <Header headerMenu={headerMenu?.menu?.items} />
            {children}
            <Footer />
          </UserProvider>
        </CartProvider>
      </ToastProvider>
    </LayoutContainer>
  );
};

export default RootLayout;
