import '../styles/globals.css';

import { Inter, Poppins } from 'next/font/google';
import { CartProvider } from 'src/contexts/CartContext/CartContext';
import { UserProvider } from 'src/contexts/UserContext/UserContext';

import CookieBanner from '@/components/CookieBanner';
import Footer from '@/components/Footer';
import GtmScript from '@/components/GtmScript';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import config from '@/config';
import { getCart } from '@/lib/cart';
import { getCartId } from '@/lib/cart-helpers';
import { getWishlist } from '@/lib/wishlist';
import { storefrontSdk } from '@/shopify';
import { getUser } from '@/utils/users';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
});
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['600', '700'],
  display: 'swap',
  preload: true,
});

const handleInitialCart = async () => {
  const cartId = await getCartId();
  return cartId ? await getCart(cartId) : null;
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const [headerMenu, footerMenu, initialCart, user, userWishlist] = await Promise.all([
    storefrontSdk().getMenuByHandle({ handle: config.constants.menuHandles.main }),
    storefrontSdk().getMenuByHandle({ handle: config.constants.menuHandles.footer }),
    handleInitialCart(),
    getUser(),
    getWishlist(),
  ]);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} font-display scroll-smooth antialiased tracking-tight`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
      </head>
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
              <Footer menuItems={footerMenu?.menu?.items} />
            </UserProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
