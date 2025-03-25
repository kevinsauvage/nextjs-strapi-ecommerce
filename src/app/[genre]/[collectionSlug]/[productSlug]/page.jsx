import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import ProductDescription from '@/components/ProductDescription/ProductDescription';
import ProductDetails from '@/components/ProductDetails/ProductDetails';
import ProductsList from '@/components/ProductList/ProductsList';
import getClient from '@/shopify/index';

import styles from './ProductSlug.module.scss';

const ProductPage = async ({ params }) => {
  const parameters = await params;

  const product = await getClient().storefront.product.getProductByHandle({
    handle: parameters.productSlug,
  });

  if (!product) {
    notFound();
  }

  const recommendations = await getClient().storefront.product.productRecommendations({
    productId: product?.id,
  });

  const { title, descriptionHtml } = product;

  return (
    <div>
      <Breadcrumbs lastElement={title} />
      <Container>
        <div className={styles.top}>
          <ProductDescription product={product} isModal={false} />
        </div>
      </Container>
      <Container size="medium">
        <ProductDetails html={descriptionHtml} />
      </Container>
      {Array.isArray(recommendations) && recommendations.length > 0 && (
        <div className={styles.recommendations}>
          <Container size="medium">
            <h3 className={styles['recommendations-title']}>Recommendations</h3>
            <ProductsList products={recommendations} layout="grid" />
          </Container>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
