import Page from '@/layout/Page/Page';
import nextApiCall from '@/utils/apiNext';
import AddressForm from '@/components/scopes/account/AddressForm/AddressForm';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './AddressUpdate.module.scss';

function AddressUpdate() {
  const { query, back } = useRouter();
  const [address, setAddress] = useState(null);
  const { addressId } = query;
  const id = `${addressId}?model_name=${query.model_name}&customer_access_token=${query.customer_access_token}`;

  useEffect(() => {
    async function fetchAddress() {
      try {
        if (addressId && query) {
          const res = await nextApiCall.getAddressById(id);
          if (res) setAddress(res);
          else console.log('TODO: Error updating customer address');
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchAddress();
  }, [addressId, id, query]);

  if (!address) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (formData) => {
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
      setTimeout(() => {
        back();
      }, 1000);
    }
    if (customerUserErrors) {
      customerUserErrors.map((err) => toast.error(err.message));
    } else toast.error('Something went wrong');
  };

  return (
    <Page>
      <div className={styles.addresses}>
        <h1 className={styles.title}>Address update</h1>
        <p className={styles.subtitle}>
          Fill in the following fields to update your address
        </p>
        <AddressForm
          buttonText="Update Address"
          initialValues={address}
          onSubmit={handleSubmit}
        />
      </div>
    </Page>
  );
}

export default AddressUpdate;
