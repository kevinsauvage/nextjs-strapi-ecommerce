/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

import styles from './shipping.module.scss';

const ShippingPage = ({ shippingPolicy }) => {
  const { title, description } = seo.pages.privacy || {};

  return (
    <PageLayout description={description} title={title}>
      <PageBanner title={title} />
      <Breadcrumbs lastElement={title} />
      <div className={styles.privacy}>
        <Container>
          <div dangerouslySetInnerHTML={{ __html: shippingPolicy?.body }} className={styles.content} />
        </Container>
      </div>
    </PageLayout>
  );
};

export default ShippingPage;

export async function getStaticProps() {
  const shopInfo = await getClient().storefront.shop.getShippingPolicy();
  const { shippingPolicy } = shopInfo;
  return { props: { shippingPolicy } };
}
