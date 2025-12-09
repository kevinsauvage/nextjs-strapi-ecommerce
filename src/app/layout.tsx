import '../styles/globals.css';

import { Inter, Poppins } from 'next/font/google';
import { CartProvider } from 'src/contexts/CartContext/CartContext';
import { UserProvider } from 'src/contexts/UserContext/UserContext';

import { getCartAction } from '@/actions/cartActions';
import { getWishlistAction } from '@/actions/whishlistActions';
import CookieBanner from '@/components/CookieBanner';
import Footer from '@/components/Footer';
import GtmScript from '@/components/GtmScript';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { storefrontSdk } from '@/shopify';
import type { CartFieldsFragment } from '@/shopify/storefront';
import { getUser } from '@/utils/users';

const inter = Inter({ subsets: ['latin'], variable: '--font-display' });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-heading', weight: '600' });

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // Fetch all data in parallel for better performance
  const [headerMenu, cart, user, userWishlist] = await Promise.all([
    storefrontSdk().getMenuByHandle({ handle: 'main-menu' }),
    getCartAction({}),
    getUser(),
    getWishlistAction(),
  ]);

  // If cart is undefined, createCartAction should have been called in middleware
  // But as a fallback, we'll create an empty cart structure
  // The cart will be properly initialized when user adds items
  if (!cart) {
    // This should rarely happen as middleware creates cart, but handle it gracefully
    console.warn('Cart not found, this should be handled by middleware');
  }

  // Use cart if available, otherwise create a minimal empty cart
  // Note: In production, middleware should always create a cart
  const initialCart: CartFieldsFragment =
    cart ??
    ({
      __typename: 'Cart',
      appliedGiftCards: [],
      attributes: [],
      buyerIdentity: {
        __typename: 'CartBuyerIdentity',
        countryCode: null,
        deliveryAddressPreferences: [],
        email: null,
        phone: null,
      },
      checkoutUrl: '',
      cost: {
        __typename: 'CartCost',
        subtotalAmount: {
          __typename: 'MoneyV2',
          amount: '0',
          currencyCode: 'USD',
        },
        totalAmount: {
          __typename: 'MoneyV2',
          amount: '0',
          currencyCode: 'USD',
        },
        totalDutyAmount: null,
        totalTaxAmount: {
          __typename: 'MoneyV2',
          amount: '0',
          currencyCode: 'USD',
        },
      },
      createdAt: new Date().toISOString(),
      discountCodes: [],
      id: '',
      lines: {
        __typename: 'BaseCartLineConnection',
        edges: [],
        pageInfo: {
          __typename: 'PageInfo',
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
        },
      },
      note: null,
      totalQuantity: 0,
      updatedAt: new Date().toISOString(),
    } as CartFieldsFragment);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} font-display scroll-smooth antialiased tracking-tight`}
      suppressHydrationWarning
    >
      <body className="relative bg-background min-h-screen flex flex-col">
        <GtmScript />
        <CookieBanner />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider initialCart={initialCart}>
            <UserProvider user={user} userWishlist={userWishlist}>
              <Header headerMenu={headerMenu?.menu || null} />
              <main className="min-h-[calc(100vh-76px)]">{children}</main>
              <Toaster richColors />
              <Footer />
            </UserProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
