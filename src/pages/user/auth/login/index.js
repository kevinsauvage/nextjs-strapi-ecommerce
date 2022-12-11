import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import Form from '@/components/forms/Form/Form';
import useForm from '@/hooks/useForm';
import useUserContext from '@/contexts/UserContext/useUserContext';
import config from '@/config/index';
import nextApiCall from '@/utils/apiNext';
import { actions } from '@/contexts/UserContext/UserReducer';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import { useCallback } from 'react';
import styles from './Login.module.scss';

const { userFeedback } = config;

function LoginPage() {
  const { toggleLoading, dispatch, handleError } = useUserContext();
  const { handleResponse } = useCheckoutContext();

  const { push } = useRouter();

  const handleAssociateCustomer = useCallback(async () => {
    const res = await nextApiCall.associateCustomerToCheckout();
    handleResponse(res, null, false);
  }, [handleResponse]);

  const onSubmit = async ({ email, password }) => {
    if (!email || !password) return toast.error(userFeedback?.missingFields);
    toggleLoading(true);
    const resLogin = await nextApiCall.login({ email, password });
    toggleLoading(false);
    const customerUserErrors = resLogin?.customerUserErrors;
    if (customerUserErrors?.length) return handleError(customerUserErrors);
    const customer = resLogin?.customer;
    if (customer?.id) {
      toast.success(userFeedback.login.success);
      dispatch({ type: actions.ADD_USER, payload: customer });
      handleAssociateCustomer();
      return push(config.routes.account);
    }
    return toast.error(userFeedback.login.error);
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title="User Login">
      <div>
        <Form
          title="LOGIN TO YOUR ACCOUNT"
          subtitle="Please complete the form below to login to your account"
          onSubmit={(e) => handleSubmit(e)}
        >
          <Input
            id="email"
            label="Email address"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            id="password"
            label="Password"
            onChange={handleInputChange}
          />
          <Button width="100%" text="Login" type="submit" tertiary />
          <div className={styles.forgotPassword}>
            <Link href={config.routes.emailResetPassword}>Reset Password</Link>
          </div>
          <div className={styles.register}>
            Don&apos;t have an account?{' '}
            <Link href={config.routes.register}>Register</Link> now.
          </div>
        </Form>
      </div>
    </Page>
  );
}

export default LoginPage;
