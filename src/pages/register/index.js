import Link from 'next/link';
import Input from '@/components/_scopes/forms/Input/Input';
import Form from '@/components/_scopes/forms/Form/Form';
import config from '@/config/index';
import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import { handleSetTokenCookies } from '@/helpers/cookies';
import getClient from '@/shopify/index';

const { userFeedback } = config;

function RegisterPage() {
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();
  const { push } = useRouter();

  const onSubmit = async (formData) => {
    const { email, password } = formData;
    try {
      if (!password || password.length < 8) throw new Error(config.userFeedback.passwordLength);
      if (!email) throw new Error(userFeedback?.missingFields);
      toggleLoading(true);

      // Register the user
      const registerRes = await getClient().customer.customerCreate({ input: { email, password } });
      if (!registerRes) throw new Error(userFeedback?.register.error);
      const userErrors = registerRes?.userErrors;
      if (userErrors?.length) return userErrors.forEach((element) => showToast.error(element.message));
      showToast.success(userFeedback?.register?.success);

      // Login the user
      const dataLogin = await getClient().customer.customerAccessTokenCreate({ input: { email, password } });

      const accessToken = dataLogin?.customerAccessToken?.accessToken;
      if (!accessToken) {
        console.error('login failed after registration');
        return push(config.routes.login);
      }
      handleSetTokenCookies(accessToken);

      // Associate user to checkout
      const checkoutId = localStorage.getItem(config.localStorageKeys.checkoutIdSorageKey);
      if (checkoutId) {
        const assosiateRes = await getClient().checkout.associateCustomerToCheckout(checkoutId, accessToken);
        if (assosiateRes?.email) console.error('Could not associate user to checkout', assosiateRes);
      } else {
        console.warn('Checkout id not fount');
      }

      return push(config.routes.account);
    } catch (error) {
      return showToast.error(error.message);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <PageLayout title="Register your account">
      <FormContainer>
        <Form autoComplete="off" onSubmit={onSubmit} title="Register" requiredFields={['email', 'password']}>
          <Input
            id="email"
            label="Email address"
            name="email"
            type="text"
            placeholder="Email"
            autoComplete="off"
            required="true"
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            id="password"
            label="Password"
            autoComplete="off"
            required="true"
          />
          <Buttons text="REGISTER">
            <Link href={config.routes.login}>LOGIN</Link>
          </Buttons>
        </Form>
      </FormContainer>
    </PageLayout>
  );
}

export default RegisterPage;
