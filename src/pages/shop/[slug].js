import { useRouter } from 'next/router';
import { messages } from '@/config/i18n';
import { getShopifyClient, parseShopifyResponse } from '@/lib/shopify/index';
import Page from '@/components/Page/Page';
import Container from '@/components/Container/Container';
import ProductPresenter from '@/components/ProductPresenter/ProductPresenter';
import styles from './slug.module.scss';

function ProductPage({ product }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  const { title, description } = product;

  return (
    <Page title={title} description={description}>
      <Container>
        <div className={styles.content}>
          <ProductPresenter product={product} />
        </div>
      </Container>
    </Page>
  );
}

export default ProductPage;

export async function getStaticProps({ params, locale }) {
  const data = await getShopifyClient(locale).product.fetchByHandle(
    params.slug
  );
  return {
    props: { product: parseShopifyResponse(data), messages: messages[locale] },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths({ locales }) {
  const data = await getShopifyClient().product.fetchAll();
  const products = parseShopifyResponse(data);

  const paths = locales.reduce(
    (acc, next) => [
      ...acc,
      ...products.map((product) => ({
        params: { slug: String(product.handle) },
        locale: next,
      })),
    ],
    []
  );

  return {
    paths,
    fallback: true,
  };
}
