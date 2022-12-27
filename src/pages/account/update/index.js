import Page from '@/layout/Page/Page';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import nextApiCall from '@/utils/apiNext';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import config from '@/config/index';
import Form from '@/components/forms/Form/Form';
import useUserContext from '@/contexts/UserContext/useUserContext';
import Input from '@/components/forms/Input/Input';
import { actions } from '@/contexts/UserContext/UserReducer';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/forms/Buttons/Buttons';
import styles from './Update.module.scss';

function OrderDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, handleError, dispatch } = useUserContext();
  const { toggleLoading } = useGlobalContext();

  useEffect(() => {
    if (user?.id) setIsLoading(false);
  }, [user]);

  const { email, firstName, lastName, password, phone } = user || {};

  const [formValues, setFormValues] = useState({
    acceptsMarketing: true,
    email: email || '',
    firstName: firstName || '',
    lastName: lastName || '',
    password: password || '',
    phone: phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        acceptsMarketing: true,
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        password: password || '',
        phone: phone || '',
      });
    }
  }, [email, firstName, lastName, password, phone, user]);

  const handleSubmit = async (formData) => {
    if (
      !formData.password ||
      !formData.email ||
      !formData.firstName ||
      !formData.lastName
    ) {
      return toast.error('Please fill in all required fields');
    }
    try {
      toggleLoading(true);
      const updateResponse = await nextApiCall.updateCustomer(formData);

      const { customer, customerUserErrors } = updateResponse || {};

      if (customerUserErrors?.length) return handleError(customerUserErrors);

      if (customer) {
        toast.success('Customer information updated successfully');
        return dispatch({ type: actions.ADD_USER, payload: customer });
      }
      return toast.error('Something went wrong');
    } catch (err) {
      return toast.error(err.message);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <Page
      title="Update account Information"
      bannerTitle="Update your information"
      bannerDescription="Welcome to the personal information update page! Here you can easily update your name, email, and password. Simply fill out the form and click 'Save Changes' to update your account. We appreciate you keeping your information current to help us provide a secure and personalized shopping experience. If you have any questions, please don't hesitate to contact us. Thank you for choosing us!"
      backTo={{ name: 'Back to Account', href: config.routes.account }}
    >
      <AccountLayout loading={isLoading || !user}>
        <Form
          onSubmit={handleSubmit}
          title="Update your information"
          initialValues={formValues}
        >
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <Input
                input="true"
                id="firstName"
                type="text"
                label="First Name"
                name="firstName"
              />
              <Input
                input="true"
                id="lastName"
                type="text"
                name="lastName"
                label="Last Name"
              />
            </div>
            <div className={styles.wrapper}>
              <Input
                input="true"
                id="email"
                type="email"
                label="Email Address"
                name="email"
              />
              <Input
                input="true"
                id="password"
                type="password"
                name="password"
                label="Password"
              />
            </div>
            <Input
              input="true"
              id="phone"
              type="text"
              name="phone"
              label="Phone"
            />
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
          </div>
          <Buttons text="UPDATE INFO" />
        </Form>
      </AccountLayout>
    </Page>
  );
}

export default OrderDetail;
