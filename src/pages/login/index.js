import { useRouter } from 'next/router';
import Link from 'next/link';
import Input from '@/components/_scopes/forms/Input/Input';
import Form from '@/components/_scopes/forms/Form/Form';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import Wrapper from '@/components/Wrapper/Wrapper';
import { loginCustomer } from '@/lib/shopify/customer/customerApiCall';
import { useEffect } from 'react';

const { userFeedback } = config;

function LoginPage() {
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();
  const { push } = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem(config.localStorageKeys.shopifyToken);
    if (token) {
      push(config.routes.account);
    }
  }, [push]);

  const onSubmit = async ({ email, password }) => {
    if (!email || !password) return showToast.error(userFeedback?.missingFields);

    toggleLoading(true);
    const resLogin = await loginCustomer({ email, password });
    toggleLoading(false);

    const customerUserErrors = resLogin?.customerUserErrors;
    if (customerUserErrors?.length) {
      return customerUserErrors.forEach((element) => showToast.error(element.message));
    }

    const accessToken = resLogin?.customerAccessToken?.accessToken;
    if (!accessToken) return showToast.error(userFeedback.login.error);
    window.localStorage.setItem(config.localStorageKeys.shopifyToken, accessToken);

    showToast.success(userFeedback.login.success);
    return push(config.routes.account);
  };

  return (
    <PageLayout title="User Login">
      <FormContainer>
        <Form onSubmit={onSubmit} title="Login" requiredFields={['email', 'password']}>
          <Input
            id="email"
            label="Email address"
            type="email"
            name="email"
            placeholder="Email"
            input="true"
            required="true"
          />
          <Input
            type="password"
            name="password"
            id="password"
            label="Password"
            placeholder="Password"
            input="true"
            required="true"
          />
          <Buttons text="Login">
            <Wrapper gap="6px">
              <Link href={config.routes.register}>REGISTER</Link> or
              <Link href={config.routes.emailResetPassword}>RESET PASSWORD</Link>
            </Wrapper>
          </Buttons>
        </Form>
      </FormContainer>
    </PageLayout>
  );
}

export default LoginPage;
