/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import getClient from '@/shopify/index';

import styles from './Terms.module.scss';

const TermsPage = async () => {
  const shopInfo = await getClient().storefront.shop.getTermsOfService();
  const { termsOfService } = shopInfo;

  return (
    <div>
      <PageBanner title={seo.pages.terms.title} />
      <Breadcrumbs lastElement={seo.pages.terms.title} />
      <div className={styles.terms}>
        <Container>
          <div dangerouslySetInnerHTML={{ __html: termsOfService?.body }} />
        </Container>
      </div>
    </div>
  );
};

export default TermsPage;
