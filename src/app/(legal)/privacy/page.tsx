import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';

import MainContent from '../_components/MainContent';

import { generateMetadata as generateMetadataUtil } from '@/utils/metadata';

export const metadata: Metadata = generateMetadataUtil({
  title: seo.pages.privacy.title,
  description: seo.pages.privacy.description,
  url: '/privacy',
});

const PrivacyPage = async () => {
  const shopInfo = await storefrontSdk().getPrivacyPolicy({});
  const privacyPolicy = shopInfo?.shop.privacyPolicy;
  const { title, description } = seo.pages.privacy || {};

  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs lastElement={title} />
      </PageBanner>
      <MainContent>
        {privacyPolicy?.body && <div dangerouslySetInnerHTML={{ __html: privacyPolicy.body }} />}
      </MainContent>
    </div>
  );
};

export default PrivacyPage;
