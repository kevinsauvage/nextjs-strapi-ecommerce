import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import nextApiCall from '@/utils/apiNext';
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
    try {
      toggleLoading(true);
      const updateResponse = await nextApiCall.updateCustomer(formData);

      const { customer, customerUserErrors } = updateResponse || {};

      if (customerUserErrors?.length)
        return customerUserErrors.forEach((element) => showToast.error(element.message));

      if (customer) {
        showToast.success('Customer information updated successfully');
        return dispatch({ type: actions.ADD_USER, payload: customer });
      }
      return showToast.error('Something went wrong');
    } catch (err) {
      return showToast.error(err.message);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <PageLayout title="Update account Information">
      <AccountLayout loading={isLoading || !id} title="Account Details">
        <Form
          onSubmit={handleSubmit}
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
            <Input input="true" id="firstName" type="text" label="First Name" name="firstName" required />
            <Input input="true" id="lastName" type="text" name="lastName" label="Last Name" required />
          </Row>
          <Row>
            <Input input="true" id="email" type="email" label="Email Address" name="email" required />
            <Input input="true" id="password" type="password" name="password" label="Password" />
          </Row>
          <Row>
            <Input input="true" id="phone" type="text" name="phone" label="Phone" />
          </Row>
          <Buttons text="UPDATE INFO">
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
          </Buttons>
        </Form>
      </AccountLayout>
    </PageLayout>
  );
}

OrderDetail.getLayout = (page) => <UserProvider>{page}</UserProvider>;

export default OrderDetail;
