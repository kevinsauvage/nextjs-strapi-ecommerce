import PageLayout from '@/layout/PageLayout/PageLayout';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import Container from '@/components/Container/Container';
import useUserContext from '@/contexts/UserContext/useUserContext';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { handleGetTokenCookies } from '@/helpers/cookies';
import config from '@/config/index';
import { useEffect, useState } from 'react';
import getClient from '@/shopify/index';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import styles from './Wishlist.module.scss';

function Wishlist() {
  const { wishlist, user, setUserWishlist } = useUserContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCustomer = async () => {
      if (!user?.id) if (wishlist.length) return null;

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
        const metafield = wishlistRes.filter((item) => item.key === 'wishlist')?.[0]?.value;
        const value = metafield && JSON.parse(metafield);
        if (value) return setUserWishlist(Array.isArray(value) ? value : [value]);
      }
      return null;
    };

    getCustomer();
  }, [user, setUserWishlist, wishlist.length]);

  return (
    <PageLayout title="Wishlist">
      <PageBanner title="Wishlist" />
      <Breadcrumbs />
      <Container extraClass={styles.container}>
        <ProductsList loading={loading} layout="grid" products={wishlist} />
      </Container>
    </PageLayout>
  );
}

export default Wishlist;
