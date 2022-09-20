import { getShopifyClient, parseShopifyResponse } from '@/lib/shopify/index';
import Page from '@/components/Page/Page';
import Container from '@/components/Container/Container';
import ProductPresenter from '@/components/ProductPresenter/ProductPresenter';
import { useRouter } from 'next/router';
import { getProductRecommendation } from '@/lib/shopify/products';
import ProductCardDefault from '@/components/ProductCardDefault/ProductCardDefault';
import Carousel from '@/components/Carousel/Carousel';
import styles from './slug.module.scss';

function ProductPage({ product, recommendations = [] }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading category...</div>;
  const { title, description } = product;

  return (
    <Page title={title} description={description}>
      <Container width={270} padding={20}>
        <div className={styles.content}>
          <ProductPresenter product={product} />

          <Carousel title="Recommended Products">
            {recommendations.map((prod) => (
              <ProductCardDefault key={product.id} product={prod} />
            ))}
          </Carousel>
        </div>
      </Container>
    </Page>
  );
}

export default ProductPage;

export async function getStaticProps({ params }) {
  const data = await getShopifyClient().product.fetchByHandle(params.slug);

  const product = parseShopifyResponse(data);

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
  const data = await getShopifyClient().product.fetchAll();
  const products = parseShopifyResponse(data);

  const paths = products.map((product) => ({
    params: { slug: String(product.handle) },
  }));

  return {
    paths,
    fallback: true,
  };
}
