/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

import styles from './Terms.module.scss';

function TermsPage({ termsOfService }) {
  return (
    <PageLayout title={seo.pages.terms.title} description={seo.pages.terms.description}>
      <PageBanner title={seo.pages.terms.title} />
      <Breadcrumbs lastElement={seo.pages.terms.title} />
      <div className={styles.terms}>
        <Container>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: termsOfService?.body }} />
        </Container>
      </div>
    </PageLayout>
  );
}

export default TermsPage;

export async function getStaticProps() {
  const shopInfo = await getClient().storefront.shop.getTermsOfService();
  const { termsOfService } = shopInfo;
  return { props: { termsOfService } };
}
