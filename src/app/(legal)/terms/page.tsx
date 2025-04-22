/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';

import styles from './Terms.module.scss';

const TermsPage = async () => {
  const response = await storefrontSdk().getTermsOfService({});
  const { termsOfService } = response?.shop || {};

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
