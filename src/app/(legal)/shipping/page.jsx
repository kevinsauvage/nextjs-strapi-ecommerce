/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import getClient from '@/shopify/index';

import styles from './page.module.scss';

const ShippingPage = async () => {
  const shopInfo = await getClient().storefront.shop.getShippingPolicy();
  const { shippingPolicy } = shopInfo || {};
  const { title, description } = seo.pages.privacy || {};

  return (
    <div>
      <PageBanner title={title} description={description} />
      <Breadcrumbs lastElement={title} />
      <div className={styles.privacy}>
        <Container>
          <div dangerouslySetInnerHTML={{ __html: shippingPolicy?.body }} />
        </Container>
      </div>
    </div>
  );
};

export default ShippingPage;
