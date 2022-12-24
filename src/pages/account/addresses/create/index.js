import Page from '@/layout/Page/Page';
import React, { useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import AddressForm from '@/components/scopes/account/AddressForm/AddressForm';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import config from '@/config/index';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
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
      <AccountLayout
        title="Create the new address bellow"
        subtitle="To create a new address in our system, please fill in the following fields. These details will be used to accurately deliver your orders and keep track of your delivery locations. Thank you for your help in maintaining a complete and up-to-date customer address list!"
      >
        <div className={styles.addresses}>
          <AddressForm buttonText="Create Address" onSubmit={handleSubmit} />
        </div>
      </AccountLayout>
    </Page>
  );
}

export default Addresses;
