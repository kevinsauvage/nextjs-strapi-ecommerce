import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import ProductDescription from '@/components/ProductDescription/ProductDescription';
import ProductDetails from '@/components/ProductDetails/ProductDetails';
import ProductsList from '@/components/ProductList/ProductsList';
import { storefrontSdk } from '@/shopify/index';

import styles from './ProductSlug.module.scss';

type PageProperties = {
  params: Promise<{
    genre: string;
    collectionSlug: string;
    productSlug: string;
  }>;
};

const ProductPage = async ({ params }: PageProperties) => {
  const parameters = await params;

  const productResponse = await storefrontSdk().getProductByHandle({
    handle: parameters.productSlug,
    identifiers: [],
  });

  const { product } = productResponse;

  if (!product) {
    notFound();
  }

  const recommendations = await storefrontSdk().productRecommendations({
    identifiers: [],
    productId: product.id,
  });

  const title = product?.title;

  return (
    <div>
      <Breadcrumbs lastElement={title} />
      <Container>
        <div className={styles.top}>
          <ProductDescription product={product} isModal={false} />
        </div>
      </Container>
      <Container size="medium">
        <ProductDetails html={product?.descriptionHtml as string} />
      </Container>
      {recommendations?.productRecommendations?.length > 0 && (
        <div className={styles.recommendations}>
          <Container size="medium">
            <h3 className={styles['recommendations-title']}>Recommendations</h3>
            <ProductsList products={recommendations.productRecommendations} layout="grid" />
          </Container>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
