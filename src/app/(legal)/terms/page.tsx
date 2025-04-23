/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';

import MainContent from '../_components/MainContent/MainContent';

const TermsPage = async () => {
  const response = await storefrontSdk().getTermsOfService({});
  const { termsOfService } = response?.shop || {};

  return (
    <div>
      <PageBanner title={seo.pages.terms.title} />
      <Breadcrumbs lastElement={seo.pages.terms.title} />
      <MainContent>
        <div dangerouslySetInnerHTML={{ __html: termsOfService?.body }} />
      </MainContent>
    </div>
  );
};

export default TermsPage;
