import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify/index';

import MainContent from '../_components/MainContent';

export const metadata: Metadata = {
  description: seo.pages.refund.description,
  title: seo.pages.refund.title,
};

const RefoundPage = async () => {
  const response = await storefrontSdk().getRefundPolicy({});
  const refundPolicy = response.shop?.refundPolicy;

  const { title, description } = seo.pages.refund || {};

  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs lastElement={title} />
      </PageBanner>
      <MainContent>
        <div dangerouslySetInnerHTML={{ __html: refundPolicy.body }} />
      </MainContent>
    </div>
  );
};

export default RefoundPage;
