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
      try {
        if (addressId && query) {
          const res = await nextApiCall.getAddressById(addressId);
          if (res) setAddress(res);
          else toast.error('Something went wrong');
        }
      } catch (error) {
        toast.error('Something went wrong');
        back();
      } finally {
        setIsLoading(false);
      }
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
        return back();
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
    <Page title="Update Address">
      <AccountLayout
        loading={isLoading}
        title="Update your address bellow"
        backTo={{ name: 'Back to addresses', href: config.routes.addresses }}
        subtitle="As a valued customer, it is important that your orders are delivered to you accurately and on time. That's why it is essential for us to have a complete and up-to-date customer address list. Inaccurate or outdated addresses can lead to delays, lost packages, and frustration for both you and us."
      >
        <div className={styles.form}>
          {address && (
            <AddressForm
              buttonText="Update Address"
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
