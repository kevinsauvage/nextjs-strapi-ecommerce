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
import { handleSetTokenCookies } from '@/helpers/cookies';
import getClient from '@/shopify/index';

const { userFeedback } = config;

function LoginPage() {
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();
  const { push } = useRouter();

  const onSubmit = async ({ email, password }) => {
    if (!email || !password) return showToast.error(userFeedback?.missingFields);

    toggleLoading(true);
    const resLogin = await getClient().customer.customerAccessTokenCreate({ email, password });

    toggleLoading(false);

    const customerUserErrors = resLogin?.customerUserErrors;
    if (customerUserErrors?.length) {
      return customerUserErrors.forEach((element) => showToast.error(element.message));
    }

    const accessToken = resLogin?.customerAccessToken?.accessToken;
    if (!accessToken) return showToast.error(userFeedback.login.error);
    handleSetTokenCookies(accessToken);
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
            required="true"
            autoComplete="username"
          />
          <Input
            type="password"
            name="password"
            id="password"
            label="Password"
            autoComplete="current-password"
            placeholder="Password"
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
