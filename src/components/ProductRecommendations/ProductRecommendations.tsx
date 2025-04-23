import type { ProductRecommendationsQuery } from '@/shopify/storefront';

import Container from '../Container/Container';
import ProductsList from '../ProductList/ProductsList';

import styles from './ProductRecommendations.module.scss';

const ProductRecommendations = ({
  recommendations,
}: {
  recommendations: ProductRecommendationsQuery;
}) => {
  if (!recommendations?.productRecommendations?.length) {
    return null;
  }

  return (
    <div className={styles.recommendations}>
      <Container size="medium">
        <h3 className={styles.title}>Recommendations</h3>
        <ProductsList products={recommendations.productRecommendations} layout="grid" />
      </Container>
    </div>
  );
};
export default ProductRecommendations;
