import Page from '@/layout/Page/Page';
import React, { useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import AddressForm from '@/components/scopes/account/AddressForm/AddressForm';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import config from '@/config/index';
import styles from './create.module.scss';

function Addresses() {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const handleSubmit = async (address) => {
    setIsLoading(true);
    window.scrollTo(0, 0);

    const { customerAddress, customerUserErrors } =
      await nextApiCall.createAddress({ address });

    if (customerAddress) {
      toast.success('Address created successfully');
      push(config.routes.addresses);
    } else if (customerUserErrors.length) {
      setIsLoading(false);
      customerUserErrors.map((err) => toast.error(err.message));
    } else toast.error('Something went wrong');
  };

  return (
    <Page loading={isLoading}>
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
