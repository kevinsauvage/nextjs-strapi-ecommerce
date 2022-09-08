import { useRouter } from 'next/router';
import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import { getShopifyClient, parseShopifyResponse } from '@/lib/shopify/index';

function CategoryPage() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading category...</div>;

  return (
    <Page title="collections">
      <div>
        <Container />
      </div>
    </Page>
  );
}

export default CategoryPage;

export async function getStaticProps({ locale }) {
  const data = await getShopifyClient(locale).collection.fetchAll();
  const collections = parseShopifyResponse(data);

  return {
    props: {
      collections,
      messages: (await import(`../locales/${locale}.json`)).default,
    },
    revalidate: 10, // In seconds
  };
}
