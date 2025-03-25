import { notFound } from 'next/navigation';

import NoAddressIllustration from '@/assets/NoAddressIllustration.svg';
import Button from '@/components/Button/Button';
import EmptyState from '@/components/EmptyState/EmptyState';
import Flexbox from '@/components/Flexbox/Flexbox';
import PageInfoPagination from '@/components/PageInfoPagination/PageInfoPagination';
import config from '@/config/index';
import getClient from '@/shopify/index';
import { getShopifyToken } from '@/utils/shopify';
import { getUser } from '@/utils/users';

import Address from '../_components/Address/Address';

import styles from './page.module.scss';

const Addresses = async ({ searchParams }) => {
  const searchParameters = await searchParams;
  const customerAccessToken = await getShopifyToken();

  const addresses = await getClient().storefront.customer.queryCustomerAddresses({
    after: searchParameters.after,
    before: searchParameters.before,
    customerAccessToken,
    first: 10,
  });

  if (addresses?.errors) {
    console.error('Addresses:', addresses.errors);
    return notFound();
  }

  const user = await getUser();

  const isDefault = (address) =>
    address.id?.split('?')?.[0] === user?.defaultAddress?.id?.split('?')?.[0];

  return (
    <div>
      <Flexbox justify="between" align="center">
        <h2>Addresses</h2>
        {Array.isArray(addresses) && addresses.length > 0 && (
          <Button extraClass={styles.button} href={config.routes.createAddress}>
            Add new address
          </Button>
        )}
      </Flexbox>

      <div>
        {Array.isArray(addresses) && addresses.length > 0 ? (
          <>
            {addresses.map((item, index) => (
              <Address
                key={item.id}
                title={`Address ${index + 1}`}
                address={item}
                isDefault={isDefault(item)}
              />
            ))}
            <PageInfoPagination pageInfo={addresses.pageInfo} searchParameters={searchParameters} />
          </>
        ) : (
          <EmptyState
            image={NoAddressIllustration}
            title="No Address Yet"
            subtitle="Please add your address for your better experience"
            altText="No Address Yet"
          >
            <Button href={config.routes.createAddress}>Add new address</Button>
          </EmptyState>
        )}
      </div>
    </div>
  );
};

export default Addresses;
