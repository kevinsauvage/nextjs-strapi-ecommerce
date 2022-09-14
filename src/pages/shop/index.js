import { useRouter } from 'next/router';
import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import ProductsList from '@/components/ProductList/ProductsList';
import { getShopifyClient, parseShopifyResponse } from '@/lib/shopify/index';
import { useTranslations } from 'next-intl';
import styles from './shop.module.scss';

function Shop({ products }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;
  const t = useTranslations('page.shop');

  return (
    <Page title={t('title')}>
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
      products: parseShopifyResponse(products),
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
    revalidate: 60, // In seconds
  };
};
