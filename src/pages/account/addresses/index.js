import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import NoAddressIllustration from '@/assets/NoAddressIllustration.svg';
import Modal from '@/components/_modals/Modal/Modal';
import Address from '@/components/_scopes/account/Address/Address';
import AddressForm from '@/components/_scopes/account/AddressForm/AddressForm';
import Button from '@/components/Button/Button';
import EmptyState from '@/components/EmptyState/EmptyState';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import useUserContext from '@/contexts/UserContext/useUserContext';
import seo from '@/data/seo';
import { handleGetTokenCookies } from '@/helpers/cookies';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

function Addresses() {
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { dispatch, user, addresses } = useUserContext();
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  useLayoutEffect(() => {
    if (addresses) setIsLoading(false);
  }, [addresses]);

  const fetchAddresses = useCallback(async () => {
    const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);
    const res = await getClient().storefront.customer.queryCustomerAddresses({
      customerAccessToken: shopifyToken,
    });
    setIsLoading(false);
    if (Array.isArray(res)) dispatch({ type: actions.ADD_ADDRESSES, payload: res });
    else showToast.error('Something went wrong, please try again later');
  }, [dispatch, showToast]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleUpdateAddress = async (formData, addressId) => {
    if (
      !formData?.address1 ||
      !formData?.city ||
      !formData?.country ||
      !formData?.firstName ||
      !formData?.lastName ||
      !formData?.zip
    ) {
      return showToast.error('Missing field');
    }
    const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

    toggleLoading(true);
    const { customerAddress, customerUserErrors } =
      await getClient().storefront.customer.customerAddressUpdate({
        address: formData,
        customerAccessToken: shopifyToken,
        addressId,
      });
    toggleLoading(false);

    if (customerAddress) {
      dispatch({
        type: actions.ADD_ADDRESSES,
        payload: addresses.map((address) => (address.id === addressId ? customerAddress : address)),
      });
      showToast.success('Address updated successfully');
    }
    if (customerUserErrors) return customerUserErrors.map((err) => showToast.error(err.message));
    return showToast.error('Something went wrong');
  };

  const handleDelete = async (id) => {
    try {
      toggleLoading(true);
      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      const deleteRes = await getClient().storefront.customer.customerAddressDelete({
        customerAccessToken: shopifyToken,
        addressId: id,
      });
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

  const handleSetAsDefault = async (id) => {
    try {
      toggleLoading(true);
      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      const res = await getClient().storefront.customer.customerDefaultAddressUpdate({
        customerAccessToken: shopifyToken,
        addressId: id,
      });
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

  const handleCreateAddress = async (address) => {
    try {
      if (
        !address?.address1 ||
        !address?.city ||
        !address?.country ||
        !address?.firstName ||
        !address?.lastName ||
        !address?.zip
      ) {
        return showToast.error('Missing field');
      }
      toggleLoading(true);

      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

      const { customerAddress, customerUserErrors } =
        (await getClient().storefront.customer.customerAddressCreate({
          address,
          customerAccessToken: shopifyToken,
        })) || {};

      if (customerAddress) {
        dispatch({
          type: actions.ADD_ADDRESSES,
          payload: [...addresses, customerAddress],
        });
        setShowCreateForm(false);
        return showToast.success('Address created successfully');
      }
      if (customerUserErrors.length) return customerUserErrors.map((err) => showToast.error(err.message));
      return showToast.error('Something went wrong');
    } catch (err) {
      return showToast.error('Error creating address, please try again later');
    } finally {
      toggleLoading(false);
    }
  };

  const isDefault = (address) => address.id?.split('?')?.[0] === user?.defaultAddress?.id?.split('?')?.[0];

  const description =
    'This page shows all of the addresses you have saved in your account. You can view and modify your addresses, including adding new ones, deleting old ones, and editing existing ones. This makes it easy to manage and update all of your addresses in one place. You can use this page to make sure all of your saved addresses are accurate and up-to-date.';

  return (
    <PageLayout title={seo.account.addresses.title} description={seo.account.addresses.description}>
      <AccountLayout
        loading={isLoading}
        title={seo.account.addresses.title}
        descriptionBannerChildren={addresses?.length > 0 && description}
        otherBannerChildrenContenct={
          <Button primary onClick={() => setShowCreateForm(true)}>
            Add new address
          </Button>
        }
      >
        {Array.isArray(addresses) && addresses.length > 0 ? (
          addresses.map((item, i) => (
            <Address
              key={item.id}
              title={`Address ${i + 1}`}
              handleSetAsDefault={handleSetAsDefault}
              handleUpdateAddress={handleUpdateAddress}
              address={item}
              isDefault={isDefault(item)}
              handleDelete={() => handleDelete(item.id)}
            />
          ))
        ) : (
          <EmptyState
            image={NoAddressIllustration}
            title="No Address Yet"
            subtitle="Please add your address for your better experience"
          >
            <Button primary onClick={() => setShowCreateForm(true)}>
              Add new address
            </Button>
          </EmptyState>
        )}
      </AccountLayout>
      {showCreateForm && (
        <Modal handleClose={() => setShowCreateForm(false)}>
          <AddressForm title="Create address" buttonText="Create Address" onSubmit={handleCreateAddress} />
        </Modal>
      )}
    </PageLayout>
  );
}

export default Addresses;
