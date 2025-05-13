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

import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-display' });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-heading', weight: '600' });

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const headerMenu = await storefrontSdk().getMenuByHandle({
    handle: 'main-menu',
  });
  const cart = await getCartAction({});
  const user = await getUser();
  const userWishlist = await getWishlistAction();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} font-display scroll-smooth antialiased tracking-tight`}
      suppressHydrationWarning
    >
      <body className="relative bg-background">
        <GtmScript />
        <CookieBanner />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider initialCart={cart as unknown as CartFieldsFragment}>
            <UserProvider user={user} userWishlist={userWishlist}>
              <Header headerMenu={headerMenu?.menu?.items} />
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
