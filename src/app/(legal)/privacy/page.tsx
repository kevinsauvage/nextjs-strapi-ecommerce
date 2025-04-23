import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';

import MainContent from '../_components/MainContent/MainContent';

const PrivacyPage = async () => {
  const shopInfo = await storefrontSdk().getPrivacyPolicy({});
  const privacyPolicy = shopInfo?.shop.privacyPolicy;

  return (
    <div>
      <PageBanner title={seo.pages.privacy.title} />
      <Breadcrumbs lastElement={seo.pages.privacy.title} />
      <MainContent>
        <div dangerouslySetInnerHTML={{ __html: privacyPolicy?.body }} />
      </MainContent>
    </div>
  );
};

export default PrivacyPage;
