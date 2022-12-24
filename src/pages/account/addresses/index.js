import Page from '@/layout/Page/Page';
import Address from '@/components/scopes/account/Address/Address';
import Card from '@/components/scopes/account/Card/Card';
import React, { useEffect, useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import { MdOutlineAdd } from 'react-icons/md';
import Link from 'next/link';
import config from '@/config/index';
import useUserContext from '@/contexts/UserContext/useUserContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import { toast } from 'react-toastify';
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
    window.scrollTo(0, 0);
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
    <Page loading={isLoading}>
      <div className={styles.addresses}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Address List</h1>
            <p className={styles.subtitle}>
              Here is a list of all your addresses :
            </p>
          </div>
          <div>
            <Link href={config.routes.createAddress}>
              Add a new address <MdOutlineAdd />
            </Link>
          </div>
        </div>

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
    </Page>
  );
}

export default Addresses;
