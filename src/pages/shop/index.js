import { useRouter } from 'next/router';
import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import ProductsList from '@/components/ProductList/ProductsList';
import { getShopifyClient, parseShopifyResponse } from '@/lib/shopify/index';
import styles from './shop.module.scss';

function Shop({ products }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <Page title="Shop page">
      <Container>
        <main className={styles.shop}>
          <div className={styles.filters}>Filters</div>
          <div>
            <ProductsList products={products} />
          </div>
        </main>
      </Container>
    </Page>
  );
}

export default Shop;

export const getStaticProps = async ({ locale }) => {
  const products = await getShopifyClient(locale).product.fetchAll();

  return {
    props: {
      messages: (await import(`../../locales/${locale}.json`)).default,
      products: parseShopifyResponse(products),
    },
    revalidate: 10, // In seconds
  };
};
