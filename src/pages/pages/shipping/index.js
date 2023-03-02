/* eslint-disable react/no-danger */
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import styles from './shipping.module.scss';

function ShippingPage({ shippingPolicy }) {
  return (
    <PageLayout title={seo.pages.privacy.title} description={seo.pages.privacy.description}>
      <PageBanner title="Shipping policy" />
      <Breadcrumbs lastElement="Shipping policy" />
      <div className={styles.privacy}>
        <Container>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: shippingPolicy?.body }} />
        </Container>
      </div>
    </PageLayout>
  );
}

export default ShippingPage;

export async function getStaticProps() {
  const shopInfo = await getClient().storefront.shop.getShippingPolicy();
  const { shippingPolicy } = shopInfo;
  return { props: { shippingPolicy } };
}
