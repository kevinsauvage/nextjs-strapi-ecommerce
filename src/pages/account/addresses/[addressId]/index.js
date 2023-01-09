import nextApiCall from '@/utils/apiNext';
import AddressForm from '@/components/_scopes/account/AddressForm/AddressForm';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import config from '@/config/index';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import PageLayout from '@/layout/PageLayout/PageLayout';

function AddressUpdate() {
  const { query, back, push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const { toggleLoading } = useGlobalContext();
  const { addressId } = query;

  useEffect(() => {
    async function fetchAddress() {
      try {
        if (addressId && query) {
          const res = await nextApiCall.getAddressById(addressId);
          if (res) return setAddress(res);
          return toast.error('Something went wrong');
        }
      } catch (error) {
        toast.error('Something went wrong');
        return back();
      } finally {
        setIsLoading(false);
      }
      return null;
    }
    fetchAddress();
  }, [addressId, push, query, back]);

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
        return toast.error('Missing field');
      }
      toggleLoading(true);
      const { customerAddress, customerUserErrors } =
        await nextApiCall.updateAddress({ address: formData }, addressId);

      if (customerAddress) {
        setAddress(customerAddress);
        toast.success('Address updated successfully');
        return push(config.routes.addresses);
      }
      if (customerUserErrors) {
        return customerUserErrors.map((err) => toast.error(err.message));
      }
      return toast.error('Something went wrong');
    } catch (err) {
      return toast.error('Something went wrong');
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <PageLayout title="Update Address">
      <AccountLayout loading={isLoading} title="Update Address">
        {address && (
          <AddressForm
            buttonText="Update Address"
            initialValues={address}
            onSubmit={handleUpdateAddress}
          />
        )}
      </AccountLayout>
    </PageLayout>
  );
}

export default AddressUpdate;
