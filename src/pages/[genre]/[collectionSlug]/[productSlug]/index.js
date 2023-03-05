import { useRouter } from 'next/router';

import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import ProductPresenter from '@/components/_scopes/product/ProductPresenter/ProductPresenter';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

import styles from './ProductSlug.module.scss';

function ProductPage({ product, recommendations = [] }) {
  const router = useRouter();
  if (router.isFallback) return <PageLoader />;
  const { title, description } = product;

  return (
    <>
      <Breadcrumbs lastElement={title} />
      <Container extraClass={styles.container}>
        <PageLayout title={title} description={description}>
          <ProductPresenter product={product} />
          {Array.isArray(recommendations) && recommendations.length > 0 && (
            <div className={styles.recommendations}>
              <Container size="medium">
                <h3 className={styles.recommendationsTitle}>Recommendations</h3>
                <ProductsList products={recommendations} layout="grid" />
              </Container>
            </div>
          )}
        </PageLayout>
      </Container>
    </>
  );
}

export default ProductPage;

export async function getStaticProps({ params }) {
  const product =
    (await getClient().storefront.product.getProductByHandle({
      handle: params.productSlug,
      identifiers: [{ key: 'reviews', namespace: 'custom' }],
    })) || null;

  const recommendations =
    (await getClient().storefront.product.productRecommendations({ productId: product?.id })) || null;
  return { props: { product, recommendations }, revalidate: 10 };
}

export async function getStaticPaths() {
  const data = await getClient().storefront.product.getProducts({ sortKey: 'BEST_SELLING', first: 200 });

  const paths = data.products.map((product) => ({
    params: {
      genre: product.productType,
      productSlug: product.handle,
      collectionSlug: product?.collections?.[0]?.handle,
    },
  }));

  return { paths, fallback: true };
}
