/* eslint-disable react/no-danger */
import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import seo from '@/data/seo';
import { storefrontSdk } from '@/shopify';

import MainContent from '../_components/MainContent/MainContent';

const ShippingPage = async () => {
  const response = await storefrontSdk().getShippingPolicy({});
  const { shippingPolicy } = response?.shop || {};
  const { title } = seo.pages.privacy || {};

  return (
    <div>
      <PageBanner title={title} />
      <Breadcrumbs lastElement={title} />
      <MainContent>
        <div dangerouslySetInnerHTML={{ __html: shippingPolicy?.body }} />
      </MainContent>
    </div>
  );
};

export default ShippingPage;
