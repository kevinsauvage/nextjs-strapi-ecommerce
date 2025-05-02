/* eslint-disable react/no-danger */
import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify';

import MainContent from '../_components/MainContent';

const ShippingPage = async () => {
  const response = await storefrontSdk().getShippingPolicy({});
  const { shippingPolicy } = response?.shop || {};
  const { title, description } = seo.pages.shipping || {};

  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs lastElement={title} />
      </PageBanner>
      <MainContent>
        <div dangerouslySetInnerHTML={{ __html: shippingPolicy?.body }} />
      </MainContent>
    </div>
  );
};

export default ShippingPage;
