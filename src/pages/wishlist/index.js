import NoFavoriteIllustration from '@/assets/NoFavoriteIllustration.svg';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import EmptyState from '@/components/EmptyState/EmptyState';
import useUserContext from '@/contexts/UserContext/useUserContext';
import seo from '@/data/seo';
import PageLayout from '@/layout/PageLayout/PageLayout';

import styles from './Wishlist.module.scss';

const Wishlist = () => {
  const { wishlist, wishlistLoading } = useUserContext();

  return (
    <PageLayout title={seo.wishlist.title} description={seo.wishlist.description}>
      <PageBanner title={seo.wishlist.title} />
      <Breadcrumbs />
      <Container extraClass={styles.container}>
        {!wishlistLoading && wishlist.length === 0 ? (
          <EmptyState
            image={NoFavoriteIllustration}
            title="No Favourites"
            subtitle="You can add an item to your favourites by clicking the “Heart Icon”"
          />
        ) : (
          <ProductsList loading={wishlistLoading} layout="grid" products={wishlist} />
        )}
      </Container>
    </PageLayout>
  );
};

export default Wishlist;
