import { useRouter } from 'next/router';
import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import ProductsList from '@/components/ProductList/ProductsList';
import { getShopifyClient, parseShopifyResponse } from '@/lib/shopify/index';
import { useTranslations } from 'next-intl';

function CategoryPage({ category }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading category...</div>;
  const t = useTranslations('page.pdp');

  return (
    <Page title={`${t('title')} : ${category?.title}`}>
      <div>
        <Container>
          <ProductsList products={category?.products} />
        </Container>
      </div>
    </Page>
  );
}

export default CategoryPage;

export async function getStaticProps({ params, locale }) {
  const data = await getShopifyClient(locale).collection.fetchByHandle(
    params.slug
  );
  const category = parseShopifyResponse(data);

  return {
    props: {
      category,
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
    revalidate: 60, // In seconds
  };
}

export async function getStaticPaths({ locales, locale }) {
  const data = await getShopifyClient(locale).collection.fetchAll();
  const collections = parseShopifyResponse(data);

  const paths = locales.reduce(
    (acc, next) => [
      ...acc,
      ...collections.map((cat) => ({
        params: { slug: String(cat.handle) },
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
