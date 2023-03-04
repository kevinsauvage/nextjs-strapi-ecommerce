/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

import styles from './refund.module.scss';

function RefoundPage({ refundPolicy }) {
  return (
    <PageLayout title={seo.pages.refund.title} description={seo.pages.refund.description}>
      <PageBanner title={seo.pages.refund.title} />
      <Breadcrumbs lastElement={seo.pages.refund.title} />
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
