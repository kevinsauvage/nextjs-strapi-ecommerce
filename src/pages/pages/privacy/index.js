/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

import styles from './Privacy.module.scss';

const PrivacyPage = ({ privacyPolicy }) => {
  return (
    <PageLayout title={seo.pages.privacy.title} description={seo.pages.privacy.description}>
      <PageBanner title={seo.pages.privacy.title} />
      <Breadcrumbs lastElement={seo.pages.privacy.title} />
      <div className={styles.privacy}>
        <Container>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: privacyPolicy?.body }} />
        </Container>
      </div>
    </PageLayout>
  );
};

export default PrivacyPage;

export async function getStaticProps() {
  const shopInfo = await getClient().storefront.shop.getPrivacyPolicy();
  const privacyPolicy = shopInfo?.privacyPolicy;
  return { props: { privacyPolicy } };
}
