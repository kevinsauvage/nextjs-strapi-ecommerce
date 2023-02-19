import AddressForm from '@/components/_scopes/account/AddressForm/AddressForm';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import config from '@/config/index';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import { handleGetTokenCookies } from '@/helpers/cookies';
import getClient from '@/shopify/index';

function AddressUpdate() {
  const { query, back, push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const { toggleLoading } = useGlobalContext();
  const { addressId } = query;
  const { showToast } = useToastContext();

  useEffect(() => {
    async function fetchAddress() {
      if (addressId && query) {
        const res = await getClient().customer.queryCustomerAddressById({ addressId });
        setIsLoading(false);
        if (res) return setAddress(res);
        showToast.error('Something went wrong');
        return back();
      }
      return null;
    }
    fetchAddress();
  }, [addressId, push, query, back, showToast]);

  const handleUpdateAddress = async (formData) => {
    if (
      !formData?.address1 ||
      !formData?.city ||
      !formData?.country ||
      !formData?.firstName ||
      !formData?.lastName ||
      !formData?.zip
    ) {
      return showToast.error('Missing field');
    }
    const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

    toggleLoading(true);
    const { customerAddress, customerUserErrors } = await getClient().customer.customerAddressUpdate({
      address: formData,
      customerAccessToken: shopifyToken,
      addressId,
    });
    toggleLoading(false);

    if (customerAddress) {
      setAddress(customerAddress);
      showToast.success('Address updated successfully');
      return push(config.routes.addresses);
    }
    if (customerUserErrors) return customerUserErrors.map((err) => showToast.error(err.message));
    return showToast.error('Something went wrong');
  };

  return (
    <PageLayout title="Update Address">
      <AccountLayout loading={isLoading} title="Update Address">
        {address && (
          <AddressForm buttonText="Update Address" initialValues={address} onSubmit={handleUpdateAddress} />
        )}
      </AccountLayout>
    </PageLayout>
  );
}

AddressUpdate.getLayout = (page) => <UserProvider>{page}</UserProvider>;

export default AddressUpdate;
