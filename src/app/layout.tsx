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
import { getUser } from '@/utils/users';

const inter = Inter({ subsets: ['latin'], variable: '--font-display' });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-heading', weight: '600' });

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const [headerMenu, footerMenu, cart, user, userWishlist] = await Promise.all([
    storefrontSdk().getMenuByHandle({ handle: 'main-menu' }),
    storefrontSdk().getMenuByHandle({ handle: 'footer' }),
    getCartAction({}),
    getUser(),
    getWishlistAction(),
  ]);

  if (!cart) {
    throw new Error('Cart not found');
  }

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
          <CartProvider initialCart={cart}>
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
