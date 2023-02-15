import { useRouter } from 'next/router';
import { getProduct, getProductRecommendation, getProducts } from '@/lib/shopify/product/productApiCall';
import ProductPresenter from '@/components/_scopes/product/ProductPresenter/ProductPresenter';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import PageLayout from '@/layout/PageLayout/PageLayout';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
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
            <div className={styles.carousel}>
              <h3 className={styles.recommendationsTitle}>Recommendations</h3>
              <ProductsList products={recommendations} layout="grid" />
            </div>
          )}
        </PageLayout>
      </Container>
    </>
  );
}

export default ProductPage;

export async function getStaticProps({ params }) {
  const product = (await getProduct(params.productSlug)) || null;
  const recommendations = (await getProductRecommendation(product?.id)) || null;
  return { props: { product, recommendations }, revalidate: 10 };
}

export async function getStaticPaths() {
  const data = await getProducts('BEST_SELLING', 200);
  const paths = data.products.map((product) => ({
    params: {
      genre: product.productType,
      productSlug: product.handle,
      collectionSlug: product?.collections?.[0]?.handle,
    },
  }));

  return { paths, fallback: true };
}
