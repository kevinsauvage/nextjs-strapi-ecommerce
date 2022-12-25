import Page from '@/layout/Page/Page';
import Address from '@/components/scopes/account/Address/Address';
import Card from '@/components/scopes/account/Card/Card';
import React, { useEffect, useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import { toast } from 'react-toastify';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import CreateAddressButton from '@/components/scopes/account/CreateAddressButton/CreateAddressButton';
import styles from './Addresses.module.scss';

function Addresses() {
  const [addresses, setAddresses] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError, dispatch, user } = useUserContext();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await nextApiCall.getCustomerAddresses();
        setAddresses(res);
      } catch (e) {
        toast.error('Something went wrong, please try again later');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleSetAsDefault = async (id) => {
    setIsLoading(true);
    const res = await nextApiCall.updateCustomerDefaultAddress(id);
    setIsLoading(false);
    const { customer, customerUserErrors } = res || {};
    if (customer?.id) {
      toast.success('Address correctly set as default address');
      dispatch({ type: actions.ADD_USER, payload: customer });
    }
    handleError(customerUserErrors);
  };

  return (
    <Page>
      <AccountLayout
        loading={isLoading}
        title="Find bellow your registered address"
        subtitle="Welcome to your customer address list! Here you will find a complete record of all the addresses you have on file with us. These addresses are essential for accurate delivery of your orders and for efficient logistics and inventory management. If you need to update or delete any of your addresses, please let us know. We value your satisfaction and appreciate your help in maintaining a reliable customer address list."
      >
        <CreateAddressButton />
        <div className={styles.addresses}>
          {Array.isArray(addresses) && addresses.length > 0 ? (
            <div className={styles.list}>
              {addresses.map((item) => (
                <Card
                  key={item.id}
                  first={
                    item.id?.split('?')?.[0] ===
                    user?.defaultAddress?.id?.split('?')?.[0]
                  }
                >
                  <Address
                    isDefault={
                      item.id?.split('?')?.[0] ===
                      user?.defaultAddress?.id?.split('?')?.[0]
                    }
                    handleChange={handleSetAsDefault}
                    address={item}
                  />
                </Card>
              ))}
            </div>
          ) : (
            <p className={styles.noAddresses}>There is no addresses to show</p>
          )}
        </div>
      </AccountLayout>
    </Page>
  );
}

export default Addresses;
