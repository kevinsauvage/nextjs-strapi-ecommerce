/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';

import styles from './page.module.scss';

const PrivacyPage = async () => {
  const shopInfo = await storefrontSdk().getPrivacyPolicy({});
  const privacyPolicy = shopInfo?.shop.privacyPolicy;

  return (
    <div>
      <PageBanner title={seo.pages.privacy.title} />
      <Breadcrumbs lastElement={seo.pages.privacy.title} />
      <div className={styles.privacy}>
        <Container>
          <div dangerouslySetInnerHTML={{ __html: privacyPolicy?.body }} />
        </Container>
      </div>
    </div>
  );
};

export default PrivacyPage;
