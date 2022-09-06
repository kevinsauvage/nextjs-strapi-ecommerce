import { useRouter } from 'next/router';
import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import { messages } from '@/config/i18n';
import { getShopifyClient, parseShopifyResponse } from '@/lib/shopify';

function CategoryPage({ collections }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading category...</div>;

  console.log(collections);
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
    props: { collections, messages: messages[locale] },
    revalidate: 10, // In seconds
  };
}
