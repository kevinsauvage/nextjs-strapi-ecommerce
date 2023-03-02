/* eslint-disable react/no-danger */
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import styles from './refund.module.scss';

function RefoundPage({ refundPolicy }) {
  return (
    <PageLayout title={seo.pages.refund.title} description={seo.pages.refund.description}>
      <PageBanner title="Refund policy" />
      <Breadcrumbs lastElement="Refund policy" />
      <div className={styles.privacy}>
        <Container>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: refundPolicy?.body }} />
        </Container>
      </div>
    </PageLayout>
  );
}

export default RefoundPage;

export async function getStaticProps() {
  const shopInfo = await getClient().storefront.shop.getRefundPolicy();
  const refundPolicy = shopInfo?.refundPolicy;
  return { props: { refundPolicy } };
}
