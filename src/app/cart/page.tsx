import type { Metadata } from 'next';

import seo from '@/data/seo';
import { reportError } from '@/lib/logger';
import { storefrontSdk } from '@/shopify';

import CartView from './_components/CartView';

export const metadata: Metadata = {
  description: seo.cart.description,
  title: seo.cart.title,
  // The cart is user-specific and already disallowed in robots.ts; the
  // `noindex` directive additionally prevents indexing of linked URLs.
  robots: { index: false, follow: false },
};

/**
 * Countries the store sells to, used by the cart delivery estimator. A failed
 * lookup degrades to the cart's own localized country rather than breaking the
 * page.
 */
const getDeliveryCountries = async (): Promise<Array<{ code: string; name: string }>> => {
  try {
    const response = await storefrontSdk().getLocalization({});

    return (response.localization?.availableCountries ?? []).map((country) => ({
      code: country.isoCode,
      name: country.name,
    }));
  } catch (error) {
    reportError('cart/delivery-countries', error);
    return [];
  }
};

const CartPage = async () => {
  const countries = await getDeliveryCountries();

  return <CartView countries={countries} />;
};

export default CartPage;
