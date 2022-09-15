import Container from '@/components/Container/Container';
import Page from '@/components/Page/Page';
import { getShopifyClient, parseShopifyResponse } from '@/lib/shopify/index';
import { useTranslations } from 'next-intl';

function CategoryPage() {
  const t = useTranslations('page.collections');

  return (
    <Page title={t('title')}>
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
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
    revalidate: 60, // In seconds
  };
}
