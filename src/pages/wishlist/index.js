import { useEffect, useState } from 'react';

import NoFavoriteIllustration from '@/assets/NoFavoriteIllustration.svg';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import config from '@/config/index';
import useUserContext from '@/contexts/UserContext/useUserContext';
import seo from '@/data/seo';
import { handleGetTokenCookies } from '@/helpers/cookies';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

import styles from './Wishlist.module.scss';

function Wishlist() {
  const { wishlist, user, setUserWishlist } = useUserContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCustomer = async () => {
      if (wishlist.length) return setLoading(false);

      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      if (!shopifyToken) {
        setUserWishlist([]);
        return console.error('Missing shopify token to get customer wishlist');
      }

      setLoading(true);
      const wishlistRes = await getClient().storefront.customer.queryCustomerMetafields({
        customerAccessToken: shopifyToken,
        metafields: [{ key: 'wishlist', namespace: 'custom' }],
      });
      setLoading(false);

      if (wishlistRes?.length > 0) {
        const metafield = wishlistRes.filter((item) => item?.key === 'wishlist')?.[0]?.value;
        const value = metafield && JSON.parse(metafield);
        if (value) return setUserWishlist(Array.isArray(value) ? value : [value]);
      }
      return null;
    };

    getCustomer();
  }, [user, setUserWishlist, wishlist.length]);

  return (
    <PageLayout title={seo.wishlist.title} description={seo.wishlist.description}>
      <PageBanner title={seo.wishlist.title} />
      <Breadcrumbs />
      <Container extraClass={styles.container}>
        {!loading && wishlist.length === 0 ? (
          <EmptyState
            image={NoFavoriteIllustration}
            title="No Favourites"
            subtitle="You can add an item to your favourites by clicking the “Heart Icon”"
          />
        ) : (
          <ProductsList loading={loading} layout="grid" products={wishlist} />
        )}
      </Container>
    </PageLayout>
  );
}

export default Wishlist;
