import { useEffect, useState } from 'react';

import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import Form from '@/components/_scopes/forms/Form/Form';
import Input from '@/components/_scopes/forms/Input/Input';
import Row from '@/components/_scopes/forms/Row/Row';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import { actions } from '@/contexts/UserContext/UserReducer';
import useUserContext from '@/contexts/UserContext/useUserContext';
import seo from '@/data/seo';
import { handleGetTokenCookies, handleSetTokenCookies } from '@/helpers/cookies';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

import styles from './Update.module.scss';

function OrderDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, dispatch } = useUserContext();
  const { toggleLoading } = useGlobalContext();
  const { email, firstName, lastName, password, phone, id } = user || {};
  const { showToast } = useToastContext();

  useEffect(() => {
    if (id) setIsLoading(false);
  }, [id]);

  const handleSubmit = async (formData) => {
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
      return showToast.error('Please fill in all required fields');
    }
    toggleLoading(true);

    const resLogin = await getClient().storefront.customer.customerAccessTokenCreate({
      input: { email: user.email, password: formData.password },
    });

    if (!resLogin || !resLogin.customerAccessToken) {
      console.log(formData);
      toggleLoading(false);

      return showToast.error('Wrong current password');
    }

    const customerInput = {
      email: formData.email || '',
      password: formData.newPassword || '',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      acceptsMarketing: true,
    };

    if (phone) customerInput.phone = phone;

    const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);

    const updateResponse = await getClient().storefront.customer.customerUpdate({
      customerAccessToken: shopifyToken,
      customer: customerInput,
    });

    toggleLoading(false);

    const { customerUserErrors, customer, customerAccessToken } = updateResponse || {};

    if (customerUserErrors?.length)
      return customerUserErrors.forEach((element) => showToast.error(element.message));

    if (customer) {
      handleSetTokenCookies(customerAccessToken.accessToken);
      showToast.success('Customer information updated successfully');
      return dispatch({ type: actions.ADD_USER, payload: customer });
    }
    return showToast.error('Something went wrong');
  };

  const description =
    'On this page, you can modify personal information, communication preferences, and billing details. Keeping your account up-to-date is important for security and an easy experience. Manage your account easily with this page.';

  return (
    <PageLayout title={seo.account.update.title} description={seo.account.update.description}>
      <AccountLayout
        loading={isLoading || !id}
        title={seo.account.update.title}
        descriptionBannerChildren={description}
      >
        <Form
          onSubmit={handleSubmit}
          requiredFields={['firstName', 'lastName', 'email', 'password']}
          initialValues={{
            acceptsMarketing: true,
            email,
            firstName,
            lastName,
            password,
            phone,
          }}
        >
          <Row>
            <Input id="firstName" type="text" label="First Name" name="firstName" />
            <Input id="lastName" type="text" name="lastName" label="Last Name" />
          </Row>
          <Row>
            <Input id="email" type="email" label="Email Address" name="email" />
            <Input id="phone" type="text" name="phone" label="Phone" />
          </Row>
          <Row>
            <Input id="password" type="password" name="password" label="Current Password" />
            <Input id="newPassword" type="password" name="newPassword" label="New Password" />
          </Row>
          <label htmlFor="acceptsMarketing" className={styles.checkbox}>
            <input
              checkbox="true"
              id="acceptsMarketing"
              type="checkbox"
              name="acceptsMarketing"
              label="Accepts marketing"
            />
            <p>Check this case to receive our last update</p>
          </label>
          <Buttons text="UPDATE INFO" />
        </Form>
      </AccountLayout>
    </PageLayout>
  );
}

export default OrderDetail;
