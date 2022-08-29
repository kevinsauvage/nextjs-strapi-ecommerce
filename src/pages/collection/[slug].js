import { useRouter } from 'next/router';
import Container from '../../components/Container/Container';
import Page from '../../components/Page/Page';
import ProductsList from '../../components/ProductList/ProductsList';
import { messages } from '../../config/i18n';
import { getShopifyClient, parseShopifyResponse } from '../../lib/shopify';

function CategoryPage({ category }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading category...</div>;

  return (
    <Page title={`Category : ${category?.title}`}>
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
    props: { category, messages: messages[locale] },
    revalidate: 10, // In seconds
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
