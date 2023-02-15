import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import { useEffect, useState } from 'react';
import Form from '@/components/_scopes/forms/Form/Form';
import useUserContext from '@/contexts/UserContext/useUserContext';
import Input from '@/components/_scopes/forms/Input/Input';
import { actions } from '@/contexts/UserContext/UserReducer';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import Row from '@/components/_scopes/forms/Row/Row';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { UserProvider } from '@/contexts/UserContext/UserContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import config from '@/config/index';
import { updateUserInfo } from '@/lib/shopify/customer/customerApiCall';
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
    if (!formData.password || !formData.email || !formData.firstName || !formData.lastName) {
      return showToast.error('Please fill in all required fields');
    }

    const customerInput = {
      email: formData.email || '',
      password: formData.password || '',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      acceptsMarketing: true,
    };

    if (phone) customerInput.phone = phone;

    const shopifyToken = window.localStorage.getItem(config.localStorageKeys.shopifyToken);
    toggleLoading(true);
    const updateResponse = await updateUserInfo(shopifyToken, customerInput);
    toggleLoading(false);

    const { customerUserErrors, customer } = updateResponse || {};

    if (customerUserErrors?.length)
      return customerUserErrors.forEach((element) => showToast.error(element.message));

    if (customer) {
      showToast.success('Customer information updated successfully');
      return dispatch({ type: actions.ADD_USER, payload: customer });
    }
    return showToast.error('Something went wrong');
  };

  return (
    <PageLayout title="Update account Information">
      <AccountLayout loading={isLoading || !id} title="Account Details">
        <div className={styles.form}>
          <Form
            onSubmit={handleSubmit}
            requiredFields={['firstName', 'lastName', 'email']}
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
              <Input
                input="true"
                id="firstName"
                type="text"
                label="First Name"
                name="firstName"
                required="true"
              />
              <Input
                input="true"
                id="lastName"
                type="text"
                name="lastName"
                label="Last Name"
                required="true"
              />
            </Row>
            <Row>
              <Input
                input="true"
                id="email"
                type="email"
                label="Email Address"
                name="email"
                required="true"
              />
              <Input input="true" id="password" type="password" name="password" label="Password" />
            </Row>
            <Row>
              <Input input="true" id="phone" type="text" name="phone" label="Phone" />
            </Row>
            <label htmlFor="acceptsMarketing" className={styles.checkbox}>
              <input
                checkbox="true"
                id="acceptsMarketing"
                className={styles.checkboxInput}
                type="checkbox"
                name="acceptsMarketing"
                label="Accepts marketing"
              />
              <span>Check this case to receive our last update</span>
            </label>
            <Buttons text="UPDATE INFO" />
          </Form>
        </div>
      </AccountLayout>
    </PageLayout>
  );
}

OrderDetail.getLayout = (page) => <UserProvider>{page}</UserProvider>;

export default OrderDetail;
