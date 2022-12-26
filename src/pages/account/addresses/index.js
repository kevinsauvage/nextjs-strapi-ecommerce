import Page from '@/layout/Page/Page';
import Address from '@/components/scopes/account/Address/Address';
import Card from '@/components/scopes/account/Card/Card';
import React, { useCallback, useEffect, useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import { toast } from 'react-toastify';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import CreateAddressButton from '@/components/scopes/account/CreateAddressButton/CreateAddressButton';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './Addresses.module.scss';

function Addresses() {
  const [isLoading, setIsLoading] = useState(true);
  const { handleError, dispatch, user, addresses } = useUserContext();
  const { toggleLoading } = useGlobalContext();

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await nextApiCall.getCustomerAddresses();
      dispatch({ type: actions.ADD_ADDRESSES, payload: res });
    } catch (e) {
      toast.error('Something went wrong, please try again later');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleSetAsDefault = async (id) => {
    try {
      toggleLoading(true);
      const res = await nextApiCall.updateCustomerDefaultAddress(id);
      const { customer, customerUserErrors } = res || {};
      if (customer?.id) {
        toast.success('Address correctly set as default address');
        return dispatch({ type: actions.ADD_USER, payload: customer });
      }
      return handleError(customerUserErrors);
    } catch (error) {
      return toast.error('Something went wrong, please try again later');
    } finally {
      toggleLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      toggleLoading(true);
      const res = await nextApiCall.deleteAddress(id);
      const { customerUserErrors, deletedCustomerAddressId } = res || {};
      if (customerUserErrors?.length) return handleError(customerUserErrors);
      if (deletedCustomerAddressId) {
        await fetchAddresses();
        return toast.success('Address deleted successfully');
      }
      return toast.error('Something went wrong, please try again later');
    } catch (error) {
      return toast.error('Something went wrong, please try again later');
    } finally {
      toggleLoading(false);
    }
  };

  const isDefault = (address) =>
    address.id?.split('?')?.[0] === user?.defaultAddress?.id?.split('?')?.[0];

  useEffect(() => {
    if (addresses) setIsLoading(false);
  }, [addresses]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return (
    <Page
      title="Addresses"
      backTo={{ name: 'Back to Account', href: config.routes.account }}
      bannerTitle="Find bellow your registered address"
      bannerDescription="Welcome to your customer address list! Here you will find a complete record of all the addresses you have on file with us. These addresses are essential for accurate delivery of your orders and for efficient logistics and inventory management. If you need to update or delete any of your addresses, please let us know. We value your satisfaction and appreciate your help in maintaining a reliable customer address list."
    >
      <AccountLayout loading={isLoading}>
        <CreateAddressButton />
        <div className={styles.addresses}>
          {Array.isArray(addresses) && addresses.length > 0 ? (
            <div className={styles.list}>
              {addresses.map((item) => (
                <Card key={item.id}>
                  {!isDefault(item) && (
                    <button
                      type="button"
                      className={styles.buttonDefault}
                      onClick={() =>
                        !isDefault(item) && handleSetAsDefault(item.id)
                      }
                    >
                      Set as default
                    </button>
                  )}
                  <Address
                    isDefault={isDefault(item)}
                    handleChange={handleSetAsDefault}
                    address={item}
                    handleDelete={() => handleDelete(item.id)}
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
