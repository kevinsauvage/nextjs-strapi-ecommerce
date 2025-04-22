import NoAddressIllustration from '@/assets/NoAddressIllustration.png';
import Button from '@/components/Button/Button';
import EmptyState from '@/components/EmptyState/EmptyState';
import Flexbox from '@/components/Flexbox/Flexbox';
import PageInfoPagination from '@/components/PageInfoPagination/PageInfoPagination';
import config from '@/config/index';
import { adjustPaginationVariables } from '@/shopify/helpers';
import { storefrontSdk } from '@/shopify/index';
import type { MailingAddress } from '@/shopify/storefront';
import { getShopifyToken } from '@/utils/shopify';
import { getUser } from '@/utils/users';

import Address from '../_components/Address/Address';

import styles from './page.module.scss';

const Addresses = async ({
  searchParams,
}: {
  searchParams: Promise<{ after?: string; before?: string; sort_key?: string }>;
}) => {
  const searchParameters = await searchParams;
  const customerAccessToken = await getShopifyToken();

  const response = await storefrontSdk().getCustomerAddresses({
    ...adjustPaginationVariables({
      after: searchParameters.after,
      before: searchParameters.before,
      first: 6,
    }),
    customerAccessToken,
  });

  const addresses = response?.customer?.addresses.edges.map((edge) => ({
    ...edge.node,
  }));

  const pageInfo = response?.customer?.addresses.pageInfo;

  const user = await getUser();

  const isDefault = (address: MailingAddress) =>
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
            {addresses.map((item) => (
              <Address key={item.id} address={item} isDefault={isDefault(item)} />
            ))}
            <PageInfoPagination pageInfo={pageInfo} searchParameters={searchParameters} />
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
