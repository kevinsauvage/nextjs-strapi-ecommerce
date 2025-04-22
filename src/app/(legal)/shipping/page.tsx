/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify';

import styles from './page.module.scss';

const ShippingPage = async () => {
  const response = await storefrontSdk().getShippingPolicy({});
  const { shippingPolicy } = response?.shop || {};
  const { title } = seo.pages.privacy || {};

  return (
    <div>
      <PageBanner title={title} />
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
