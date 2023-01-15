import { useCallback, useEffect, useState } from 'react';
import Address from '@/components/_scopes/account/Address/Address';
import nextApiCall from '@/utils/apiNext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Section from '@/components/_scopes/account/section/Section';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import styles from './Addresses.module.scss';

function Addresses() {
  const [isLoading, setIsLoading] = useState(true);
  const { handleError, dispatch, user, addresses } = useUserContext();
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await nextApiCall.getCustomerAddresses();
      dispatch({ type: actions.ADD_ADDRESSES, payload: res });
    } catch (e) {
      showToast.error('Something went wrong, please try again later');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, showToast]);

  const handleSetAsDefault = async (id) => {
    try {
      toggleLoading(true);
      const res = await nextApiCall.updateCustomerDefaultAddress(id);
      const { customer, customerUserErrors } = res || {};
      if (customer?.id) {
        showToast.success('Address correctly set as default address');
        return dispatch({ type: actions.ADD_USER, payload: customer });
      }
      return handleError(customerUserErrors);
    } catch (error) {
      return showToast.error('Something went wrong, please try again later');
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
        return showToast.success('Address deleted successfully');
      }
      return showToast.error('Something went wrong, please try again later');
    } catch (error) {
      return showToast.error('Something went wrong, please try again later');
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
    <PageLayout title="Addresses">
      <AccountLayout loading={isLoading} title="Addresses">
        <Section title="Default Address">
          <Address address={user?.defaultAddress} isDefaultAddress />
        </Section>
        <Section title="Other Addresses">
          {Array.isArray(addresses) &&
          addresses.filter((address) => !isDefault(address)).length > 0 ? (
            <div className={styles.list}>
              {addresses
                .filter((address) => !isDefault(address))
                .map((item, i) => (
                  <Address
                    key={item.id}
                    title={`Address ${i + 1}`}
                    handleSetAsDefault={handleSetAsDefault}
                    address={item}
                    handleDelete={() => handleDelete(item.id)}
                  />
                ))}
            </div>
          ) : (
            <p className={styles.noAddresses}>There is no addresses to show</p>
          )}
        </Section>
      </AccountLayout>
    </PageLayout>
  );
}

Addresses.getLayout = (page) => <UserProvider>{page}</UserProvider>;

export default Addresses;
