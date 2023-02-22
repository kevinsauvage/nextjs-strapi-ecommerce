import PageLayout from '@/layout/PageLayout/PageLayout';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import Container from '@/components/Container/Container';
import useUserContext from '@/contexts/UserContext/useUserContext';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import styles from './Wishlist.module.scss';

function Wishlist() {
  const { wishlist } = useUserContext();

  return (
    <PageLayout title="Search page">
      <Breadcrumbs />
      <Container extraClass={styles.container}>
        <ProductsList layout="grid" products={wishlist} />
      </Container>
    </PageLayout>
  );
}

export default Wishlist;
