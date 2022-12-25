import Page from '@/layout/Page/Page';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import nextApiCall from '@/utils/apiNext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import config from '@/config/index';
import Form from '@/components/forms/Form/Form';
import useUserContext from '@/contexts/UserContext/useUserContext';
import Button from '@/components/Button/Button';
import Input from '@/components/forms/Input/Input';
import { actions } from '@/contexts/UserContext/UserReducer';
import styles from './Update.module.scss';

function OrderDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, handleError, dispatch, toggleLoading } = useUserContext();
  const { push } = useRouter();

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formValues.password ||
      !formValues.email ||
      !formValues.firstName ||
      !formValues.lastName
    ) {
      return toast.error('Please fill in all required fields');
    }
    try {
      toggleLoading(true);
      const updateResponse = await nextApiCall.updateCustomer(formValues);

      const { customer, customerUserErrors } = updateResponse || {};

      if (customerUserErrors?.length) return handleError(customerUserErrors);

      if (customer) {
        dispatch({ type: actions.ADD_USER, payload: customer });
        return push(config.routes.account);
      }
      return toast.error('Something went wrong');
    } catch (err) {
      return toast.error(err.message);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <Page title="Customer Udapte">
      <AccountLayout
        loading={isLoading}
        title="Update your information"
        subtitle='"View detailed information about a specific order, including items, delivery address, and status, on the order details page. Track the progress of your order and update your delivery address if necessary. Thank you for your business and we hope you have a great experience with us."'
      >
        <Form handleSubmit={handleSubmit}>
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <Input
                id="firstName"
                type="text"
                label="First Name"
                name="firstName"
                onChange={handleChange}
                value={formValues.firstName}
              />
              <Input
                id="lastName"
                type="text"
                name="lastName"
                label="Last Name"
                onChange={handleChange}
                value={formValues.lastName}
              />
            </div>
            <div className={styles.wrapper}>
              <Input
                id="email"
                type="email"
                label="Email Address"
                name="email"
                onChange={handleChange}
                value={formValues.email}
              />
              <Input
                id="password"
                type="password"
                name="password"
                label="Password"
                onChange={handleChange}
                value={formValues.password}
              />
            </div>
            <Input
              id="phone"
              type="text"
              name="phone"
              label="Phone"
              onChange={handleChange}
              value={formValues.phone}
            />
            <label htmlFor="acceptsMarketing">
              <input
                id="acceptsMarketing"
                type="checkbox"
                name="acceptsMarketing"
                label="Accepts marketing"
                onChange={() =>
                  setFormValues({
                    ...formValues,
                    acceptsMarketing: !formValues.acceptsMarketing,
                  })
                }
                checked={formValues.acceptsMarketing}
              />
              Check this case to receive our last update
            </label>
          </div>
          <Button type="submit" tertiary text="Update" />
        </Form>
      </AccountLayout>
    </Page>
  );
}

export default OrderDetail;
