import Page from '@/layout/Page/Page';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import nextApiCall from '@/utils/apiNext';
import { useRouter } from 'next/router';
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

  const { back } = useRouter();

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
        dispatch({ type: actions.ADD_USER, payload: customer });
        return back();
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
                input
                id="firstName"
                type="text"
                label="First Name"
                name="firstName"
                value={formValues.firstName}
              />
              <Input
                input
                id="lastName"
                type="text"
                name="lastName"
                label="Last Name"
                value={formValues.lastName}
              />
            </div>
            <div className={styles.wrapper}>
              <Input
                input
                id="email"
                type="email"
                label="Email Address"
                name="email"
                value={formValues.email}
              />
              <Input
                input
                id="password"
                type="password"
                name="password"
                label="Password"
                value={formValues.password}
              />
            </div>
            <Input
              input
              id="phone"
              type="text"
              name="phone"
              label="Phone"
              value={formValues.phone}
            />
            <label htmlFor="acceptsMarketing" className={styles.checkbox}>
              <input
                checkbox
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
