import AddressForm from '@/components/_scopes/account/AddressForm/AddressForm';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import config from '@/config/index';
import { handleGetTokenCookies } from '@/helpers/cookies';
import getClient from '@/shopify/index';

function Addresses() {
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const handleSubmit = async (address) => {
    try {
      if (
        !address?.address1 ||
        !address?.city ||
        !address?.country ||
        !address?.firstName ||
        !address?.lastName ||
        !address?.zip
      ) {
        return showToast.error('Missing field');
      }
      toggleLoading(true);

      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      const { customerAddress, customerUserErrors } =
        (await getClient().storefront.customer.customerAddressCreate({
          address,
          customerAccessToken: shopifyToken,
        })) || {};

      if (customerAddress) return showToast.success('Address created successfully');
      if (customerUserErrors.length) return customerUserErrors.map((err) => showToast.error(err.message));
      return showToast.error('Something went wrong');
    } catch (err) {
      return showToast.error('Error creating address, please try again later');
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <PageLayout title="Create new address">
      <AccountLayout title="Create address">
        <AddressForm buttonText="Create Address" onSubmit={handleSubmit} />
      </AccountLayout>
    </PageLayout>
  );
}

Addresses.getLayout = (page) => <UserProvider>{page}</UserProvider>;

export default Addresses;
