/* eslint-disable react/no-danger */
import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';

import MainContent from '../_components/MainContent';

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
        <div dangerouslySetInnerHTML={{ __html: termsOfService?.body }} />
      </MainContent>
    </div>
  );
};

export default TermsPage;
