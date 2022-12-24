import Page from '@/layout/Page/Page';
import nextApiCall from '@/utils/apiNext';
import AddressForm from '@/components/scopes/account/AddressForm/AddressForm';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import config from '@/config/index';
import styles from './AddressUpdate.module.scss';

function AddressUpdate() {
  const { query, back, push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const { addressId } = query;
  const id = `${addressId}?model_name=${query.model_name}&customer_access_token=${query.customer_access_token}`;

  useEffect(() => {
    async function fetchAddress() {
      try {
        if (addressId && query) {
          const res = await nextApiCall.getAddressById(id);
          if (res) setAddress(res);
          else toast.error('Something went wrong');
        }
      } catch (error) {
        toast.error('Something went wrong');
        push(config.routes.addresses);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAddress();
  }, [addressId, id, push, query]);

  const handleUpdateAddress = async (formData) => {
    try {
      setIsLoading(true);
      const { customerAddress, customerUserErrors } =
        await nextApiCall.updateAddress(
          {
            address: formData,
          },
          id
        );

      if (customerAddress) {
        setAddress(customerAddress);
        toast.success('Address updated successfully');
        back();
      }
      if (customerUserErrors) {
        customerUserErrors.map((err) => toast.error(err.message));
      } else toast.error('Something went wrong');
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Page loading={isLoading}>
      <div className={styles.addresses}>
        <h1 className={styles.title}>Address update</h1>
        <p className={styles.subtitle}>
          Fill in the following fields to update your address
        </p>
        {address && (
          <AddressForm
            buttonText="Update Address"
            initialValues={address}
            onSubmit={handleUpdateAddress}
          />
        )}
      </div>
    </Page>
  );
}

export default AddressUpdate;
