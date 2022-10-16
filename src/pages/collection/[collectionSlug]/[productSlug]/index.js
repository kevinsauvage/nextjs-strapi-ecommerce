import { useRouter } from 'next/router';
import Page from '@/layout/Page/Page';
import ProductCardDefault from '@/components/product/ProductCardDefault/ProductCardDefault';
import Carousel, { CarouselItem } from '@/components/Carousel/Carousel';
import {
  getProduct,
  getProductRecommendation,
  getProducts,
} from '@/lib/shopify/product/productApiCall';

import ProductPresenter from '@/components/product/ProductPresenter/ProductPresenter';
import { useEffect } from 'react';
import Separator from '@/components/Separator/Separator';

function ProductPage({ product, recommendations = [] }) {
  const router = useRouter();
  useEffect(() => {
    if (!product?.id) router.push('/');
  }, [router, product]);

  if (router.isFallback) return <div>Loading category...</div>;
  const { title, description } = product;

  return (
    <Page title={title} description={description}>
      <ProductPresenter product={product} />
      <Separator margin="60px 0" />
      {recommendations &&
        Array.isArray(recommendations) &&
        recommendations.length > 0 && (
          <Carousel title="Recommended Products">
            {recommendations.map((prod) => (
              <CarouselItem key={prod.id}>
                <ProductCardDefault product={prod} />
              </CarouselItem>
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
      productSlug: product.handle,
      collectionSlug: product?.collections?.[0]?.handle,
    },
  }));

  return {
    paths,
    fallback: true,
  };
}
