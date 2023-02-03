import nextApiCall from '@/utils/apiNext';
import AddressForm from '@/components/_scopes/account/AddressForm/AddressForm';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import config from '@/config/index';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import useUserContext from '@/contexts/UserContext/useUserContext';

function AddressUpdate() {
  const { query, back, push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const { toggleLoading } = useGlobalContext();
  const { addressId } = query;
  const { showToast } = useToastContext();
  const { user } = useUserContext();

  useEffect(() => {
    async function fetchAddress() {
      try {
        if (addressId && query) {
          const res = await nextApiCall.getAddressById(addressId);
          if (res) return setAddress(res);
          return showToast.error('Something went wrong');
        }
      } catch (error) {
        showToast.error('Something went wrong');
        return back();
      } finally {
        setIsLoading(false);
      }
      return null;
    }
    fetchAddress();
  }, [addressId, push, query, back, showToast]);

  const handleUpdateAddress = async (formData) => {
    try {
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
      toggleLoading(true);
      const { customerAddress, customerUserErrors } = await nextApiCall.updateAddress(
        { address: formData },
        addressId
      );

      if (customerAddress) {
        setAddress(customerAddress);
        showToast.success('Address updated successfully');
        if (user.defaultAddress.id === addressId) return push(config.routes.account);
        return push(config.routes.addresses);
      }
      if (customerUserErrors) {
        return customerUserErrors.map((err) => showToast.error(err.message));
      }
      return showToast.error('Something went wrong');
    } catch (err) {
      return showToast.error('Something went wrong');
    } finally {
      toggleLoading(false);
    }
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
