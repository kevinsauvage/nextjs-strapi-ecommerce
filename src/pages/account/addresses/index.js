import { useCallback, useEffect, useState } from 'react';
import Address from '@/components/_scopes/account/Address/Address';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import Button from '@/components/Button/Button';
import config from '@/config/index';
import {
  getCustomerAddresses,
  deleteAddressById,
  updateDefaultAddress,
} from '@/lib/shopify/customer/customerApiCall';
import styles from './Addresses.module.scss';

function Addresses() {
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch, user, addresses } = useUserContext();
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const fetchAddresses = useCallback(async () => {
    const shopifyToken = window.localStorage.getItem(config.localStorageKeys.shopifyToken);

    const res = await getCustomerAddresses(shopifyToken);
    setIsLoading(false);

    if (Array.isArray(res)) {
      dispatch({ type: actions.ADD_ADDRESSES, payload: res });
    } else {
      showToast.error('Something went wrong, please try again later');
    }
  }, [dispatch, showToast]);

  const handleSetAsDefault = async (id) => {
    try {
      toggleLoading(true);
      const shopifyToken = window.localStorage.getItem(config.localStorageKeys.shopifyToken);

      const res = await updateDefaultAddress(shopifyToken, id);
      const { customer, customerUserErrors } = res || {};

      if (customer?.id) {
        showToast.success('Address correctly set as default address');
        return dispatch({ type: actions.ADD_USER, payload: customer });
      }
      return customerUserErrors.forEach((element) => showToast.error(element.message));
    } catch (error) {
      return showToast.error('Something went wrong, please try again later');
    } finally {
      toggleLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      toggleLoading(true);
      const shopifyToken = window.localStorage.getItem(config.localStorageKeys.shopifyToken);

      const deleteRes = await deleteAddressById(shopifyToken, id);

      const { customerUserErrors, deletedCustomerAddressId } = deleteRes || {};
      if (customerUserErrors?.length)
        return customerUserErrors.forEach((element) => showToast.error(element.message));

      if (deletedCustomerAddressId) {
        await fetchAddresses();
        return showToast.success('Address deleted successfully');
      }
      return showToast.error('Something went wrong, please try again later');
    } catch (error) {
      return showToast.error('Something went wrong, please try again later');
    } finally {
      toggleLoading(false);
    }
  };

  const isDefault = (address) => address.id?.split('?')?.[0] === user?.defaultAddress?.id?.split('?')?.[0];

  useEffect(() => {
    if (addresses) setIsLoading(false);
  }, [addresses]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return (
    <PageLayout title="Addresses">
      <AccountLayout loading={isLoading} title="Addresses">
        {Array.isArray(addresses) && addresses.length > 0 ? (
          <div className={styles.list}>
            {addresses.map((item, i) => (
              <Address
                key={item.id}
                title={`Address ${i + 1}`}
                handleSetAsDefault={handleSetAsDefault}
                address={item}
                isDefault={isDefault(item)}
                handleDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        ) : (
          <p className={styles.noAddresses}>There is no addresses to show</p>
        )}
        <Button extraClass={styles.btn} primary href={config.routes.createAddress}>
          Add new address
        </Button>
      </AccountLayout>
    </PageLayout>
  );
}

Addresses.getLayout = (page) => <UserProvider>{page}</UserProvider>;

export default Addresses;
