import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';

import MainContent from '../_components/MainContent';

import { generateMetadata as generateMetadataUtil } from '@/utils/metadata';

export const metadata: Metadata = generateMetadataUtil({
  title: seo.pages.terms.title,
  description: seo.pages.terms.description,
  url: '/terms',
});

const TermsPage = async () => {
  const response = await storefrontSdk().getTermsOfService({});
  const { termsOfService } = response?.shop || {};
  const { title, description } = seo.pages.terms || {};
  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs lastElement={title} />
      </PageBanner>
      <MainContent>
        {termsOfService?.body && <div dangerouslySetInnerHTML={{ __html: termsOfService.body }} />}
      </MainContent>
    </div>
  );
};

export default TermsPage;
