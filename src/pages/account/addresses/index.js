import { useCallback, useEffect, useState } from 'react';
import Page from '@/layout/Page/Page';
import Address from '@/components/scopes/account/Address/Address';
import nextApiCall from '@/utils/apiNext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import { toast } from 'react-toastify';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Section from '@/components/scopes/account/section/Section';
import config from '@/config/index';
import Link from 'next/link';
import { MdOutlineAddLocationAlt } from 'react-icons/md';
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
    <Page title="Addresses">
      <AccountLayout loading={isLoading} title="Addresses">
        <Section title="Default Address">
          <Address address={user?.defaultAddress} isDefaultAddress />
        </Section>
        <Section title="Other Addresses">
          <Link
            href={config.routes.createAddress}
            className={styles.addNewAddress}
          >
            Add new address
            <MdOutlineAddLocationAlt />
          </Link>
          {Array.isArray(addresses) && addresses.length > 0 ? (
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
    </Page>
  );
}

export default Addresses;
