import Link from 'next/link';
import { useRouter } from 'next/router';

import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import Form from '@/components/_scopes/forms/Form/Form';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import Input from '@/components/_scopes/forms/Input/Input';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Wrapper from '@/components/Wrapper/Wrapper';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import seo from '@/data/seo';
import { handleSetTokenCookies } from '@/helpers/cookies';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

const { userFeedback } = config;

const LoginPage = () => {
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();
  const { push, query } = useRouter();

  const onSubmit = async ({ email, password }) => {
    if (!email || !password) return showToast.error(userFeedback?.missingFields);

    toggleLoading(true);
    const resLogin = await getClient().storefront.customer.customerAccessTokenCreate({
      input: { email, password },
    });
    toggleLoading(false);

    const customerUserErrors = resLogin?.customerUserErrors;
    if (customerUserErrors?.length) {
      return customerUserErrors.forEach((element) => showToast.error(element.message));
    }

    const accessToken = resLogin?.customerAccessToken?.accessToken;
    if (!accessToken) return showToast.error(userFeedback.login.error);
    const nextUrl = query?.redirectUrl ? query.redirectUrl : config.routes.account;
    showToast.success(userFeedback.login.success);

    await new Promise((resolve) => {
      handleSetTokenCookies(accessToken);
      resolve();
    });
    return push(nextUrl);
  };

  return (
    <PageLayout title={seo.login.title} description={seo.login.description}>
      <PageBanner title={seo.login.title} />
      <Breadcrumbs />
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
};

export default LoginPage;
