import { useRouter } from 'next/router';
import ProductCardDefault from '@/components/_scopes/product/ProductCardDefault/ProductCardDefault';
import Carousel from '@/components/Carousel/Carousel';
import {
  getProduct,
  getProductRecommendation,
  getProducts,
} from '@/lib/shopify/product/productApiCall';
import ProductPresenter from '@/components/_scopes/product/ProductPresenter/ProductPresenter';
import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import PageLayout from '@/layout/PageLayout/PageLayout';

function ProductPage({ product, recommendations = [] }) {
  const router = useRouter();
  if (router.isFallback) return <PageLoader />;
  const { title, description } = product;

  return (
    <PageLayout title={title} description={description}>
      <ProductPresenter product={product} />
      {Array.isArray(recommendations) && recommendations.length > 0 && (
        <Carousel
          title="Recommended Products"
          subtitle="Check out the products you may like"
          itemToShow={5}
        >
          {recommendations.map((prod) => (
            <ProductCardDefault product={prod} key={prod.id} />
          ))}
        </Carousel>
      )}
    </PageLayout>
  );
}

export default ProductPage;

export async function getStaticProps({ params }) {
  const product = await getProduct(params.productSlug);
  const recommendations = await getProductRecommendation(product?.id);
  if (!product || !recommendations) return { props: {} };

  return {
    props: {
      product,
      recommendations,
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const data = await getProducts('BEST_SELLING', 200);
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
