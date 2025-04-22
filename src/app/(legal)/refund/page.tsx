/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';

import styles from './page.module.scss';

const RefoundPage = async () => {
  const response = await storefrontSdk().getRefundPolicy({});
  const refundPolicy = response.shop?.refundPolicy;

  return (
    <div>
      <PageBanner title={seo.pages.refund.title} />
      <Breadcrumbs lastElement={seo.pages.refund.title} />
      <div className={styles.privacy}>
        <Container>
          <div dangerouslySetInnerHTML={{ __html: refundPolicy.body }} />
        </Container>
      </div>
    </div>
  );
};

export default RefoundPage;
