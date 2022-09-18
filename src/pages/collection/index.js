import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import { getShopifyClient, parseShopifyResponse } from '@/lib/shopify/index';

function CategoryPage() {
  return (
    <Page title="Collections">
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
    },
    revalidate: 60, // In seconds
  };
}
