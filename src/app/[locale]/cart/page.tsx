import type { Metadata } from 'next';

import { getSeo } from '@/data/seo';
import type { Locale } from '@/i18n/routing';
import { localeFromParams } from '@/i18n/server';
import { reportError } from '@/lib/logger';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { getStorefront } from '@/lib/server/storefront';

import CartView from './_components/CartView';

/**
 * Customer-specific: this page reads the visitor's Shopify session (and, for the
 * form pages, request-time query parameters), so it cannot be prerendered.
 * Blocking is the correct trade — the content is per-visitor, and the catalog
 * pages that carry the traffic stay static.
 */
export const instant = false;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);

  return generateMetadataUtil({
    description: getSeo(locale).cart.description,
    title: getSeo(locale).cart.title,
    url: '/cart',
    // The cart is user-specific and already disallowed in robots.ts; the
    // `noindex` directive additionally prevents indexing of linked URLs.
    noindex: true,
    locale,
  });
};

/**
 * Countries the store sells to, used by the cart delivery estimator. A failed
 * lookup degrades to the cart's own localized country rather than breaking the
 * page.
 */
const getDeliveryCountries = async (
  locale: Locale,
): Promise<Array<{ code: string; name: string }>> => {
  try {
    const response = await (await getStorefront(locale)).getLocalization({});

    return (response.localization?.availableCountries ?? []).map((country) => ({
      code: country.isoCode,
      name: country.name,
    }));
  } catch (error) {
    reportError('cart/delivery-countries', error);
    return [];
  }
};

const CartPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const countries = await getDeliveryCountries(await localeFromParams(params));

  return <CartView countries={countries} />;
};

export default CartPage;
