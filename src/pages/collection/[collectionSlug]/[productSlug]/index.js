import { useRouter } from 'next/router';
import Page from '@/layout/Page/Page';
import ProductCardDefault from '@/components/product/ProductCardDefault/ProductCardDefault';
import Carousel from '@/components/Carousel/Carousel';
import {
  getProduct,
  getProductRecommendation,
  getProducts,
} from '@/lib/shopify/product/productApiCall';

import ProductPresenter from '@/components/product/ProductPresenter/ProductPresenter';
import { useEffect } from 'react';
import styles from './slug.module.scss';

function ProductPage({ product, recommendations = [] }) {
  const router = useRouter();
  useEffect(() => {
    if (!product?.id) router.push('/');
  }, [router, product]);

  if (router.isFallback) return <div>Loading category...</div>;
  const { title, description } = product;

  return (
    <Page title={title} description={description} extraClass={styles.content}>
      <ProductPresenter product={product} />
      {recommendations &&
        Array.isArray(recommendations) &&
        recommendations.length > 0 && (
          <Carousel title="Recommended Products">
            {recommendations.map((prod) => (
              <ProductCardDefault key={product.id} product={prod} />
            ))}
          </Carousel>
        )}
    </Page>
  );
}

export default ProductPage;

export async function getStaticProps({ params }) {
  const product = await getProduct(params.productSlug);

  const recommendations = await getProductRecommendation(product.id);

  return {
    props: {
      product,
      recommendations,
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const data = await getProducts('BEST_SELLING', 100);

  const paths = data.products.map((product) => ({
    params: {
      productSlug: String(product.handle),
      collectionSlug: String(product?.collections?.[0]?.handle),
    },
  }));

  return {
    paths,
    fallback: true,
  };
}
