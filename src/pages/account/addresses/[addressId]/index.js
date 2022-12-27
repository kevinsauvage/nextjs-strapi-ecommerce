import Page from '@/layout/Page/Page';
import nextApiCall from '@/utils/apiNext';
import AddressForm from '@/components/scopes/account/AddressForm/AddressForm';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import config from '@/config/index';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './AddressUpdate.module.scss';

function AddressUpdate() {
  const { query, back, push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const { toggleLoading } = useGlobalContext();
  const { addressId } = query;

  useEffect(() => {
    async function fetchAddress() {
      if (!addressId || !query) return back();
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
    <Page
      title="Update Address"
      backTo={{ name: 'Back to addresses', href: config.routes.addresses }}
    >
      <AccountLayout loading={isLoading}>
        <div className={styles.form}>
          {address && (
            <AddressForm
              buttonText="Update Address"
              title="Update Address"
              initialValues={address}
              onSubmit={handleUpdateAddress}
            />
          )}
        </div>
      </AccountLayout>
    </Page>
  );
}

export default AddressUpdate;
