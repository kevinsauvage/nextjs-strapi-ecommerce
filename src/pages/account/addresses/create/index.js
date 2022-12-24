import Page from '@/layout/Page/Page';
import React, { useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import AddressForm from '@/components/scopes/account/AddressForm/AddressForm';
import { toast } from 'react-toastify';
import styles from './create.module.scss';

function Addresses() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (address) => {
    setIsLoading(true);

    const { customerAddress, customerUserErrors } =
      await nextApiCall.createAddress({ address });

    if (customerAddress) {
      toast.success('Address created successfully');
    }

    if (customerUserErrors) {
      customerUserErrors.map((err) => toast.error(err.message));
    } else toast.error('Something went wrong');

    setIsLoading(false);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Page>
      <div className={styles.addresses}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Create a new address</h1>
            <p className={styles.subtitle}>
              Fill in the following fields to create a new address
            </p>
          </div>
        </div>
        <AddressForm buttonText="Create Address" onSubmit={handleSubmit} />
      </div>
    </Page>
  );
}

export default Addresses;
