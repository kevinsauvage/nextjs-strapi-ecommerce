import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';

import MainContent from '../_components/MainContent/MainContent';

const RefoundPage = async () => {
  const response = await storefrontSdk().getRefundPolicy({});
  const refundPolicy = response.shop?.refundPolicy;

  return (
    <div>
      <PageBanner title={seo.pages.refund.title} />
      <Breadcrumbs lastElement={seo.pages.refund.title} />
      <MainContent>
        <div dangerouslySetInnerHTML={{ __html: refundPolicy.body }} />
      </MainContent>
    </div>
  );
};

export default RefoundPage;
