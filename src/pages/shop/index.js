import { useRouter } from 'next/router';
import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import ProductsList from '@/components/ProductList/ProductsList';
import { messages } from '@/config/i18n';
import { getShopifyClient, parseShopifyResponse } from '@/lib/shopify';
import styles from './shop.module.scss';

function Shop({ products }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  console.log(products);

  return (
    <Page title="Shop page">
      <main className={styles.shop}>
        <Container>
          <ProductsList products={products} />
        </Container>
      </main>
    </Page>
  );
}

export default Shop;

export const getStaticProps = async ({ locale }) => {
  const products = await getShopifyClient(locale).product.fetchAll();

  return {
    props: {
      messages: messages[locale],
      products: parseShopifyResponse(products),
    },
    revalidate: 10, // In seconds
  };
};
