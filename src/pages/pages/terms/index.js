/* eslint-disable react/no-danger */
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Container from '@/components/Container/Container';
import styles from './Terms.module.scss';

function TermsPage({ termsOfService }) {
  return (
    <PageLayout title="Terms and conditions">
      <PageBanner title="Terms and conditions" />
      <Breadcrumbs lastElement="Terms and conditions" />
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
