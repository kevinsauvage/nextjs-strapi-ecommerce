import Link from 'next/link';
import { useRouter } from 'next/router';

import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import Form from '@/components/_scopes/forms/Form/Form';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import Input from '@/components/_scopes/forms/Input/Input';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import seo from '@/data/seo';
import { handleSetTokenCookies } from '@/helpers/cookies';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

const { userFeedback, routes, localStorageKeys } = config;

const RegisterPage = () => {
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();
  const { push } = useRouter();

  const onSubmit = async (formData) => {
    const { email, password, firstName, lastName, passwordConfirmation } = formData;
    try {
      if (!password || password.length < 8) throw new Error(userFeedback.passwordLength);
      if (password !== passwordConfirmation) throw new Error(userFeedback.passwordDifferent);
      if (!email) throw new Error(userFeedback?.missingFields);
      toggleLoading(true);

      // Register the user
      const registerResponse = await getClient().storefront.customer.customerCreate({
        input: { email, password, firstName, lastName },
      });
      if (!registerResponse) throw new Error(userFeedback?.register.error);
      const userErrors = registerResponse?.userErrors;
      if (userErrors?.length) return userErrors.forEach((element) => showToast.error(element.message));
      showToast.success(userFeedback?.register?.success);

      // Login the user
      const dataLogin = await getClient().storefront.customer.customerAccessTokenCreate({
        input: { email, password },
      });

      const accessToken = dataLogin?.customerAccessToken?.accessToken;
      if (!accessToken) {
        console.error('login failed after registration');
        return push(routes.login);
      }
      handleSetTokenCookies(accessToken);

      // Associate user to checkout
      const checkoutId = localStorage.getItem(localStorageKeys.checkoutIdSorageKey);
      if (checkoutId) {
        const assosiateResponse = await getClient().storefront.checkout.associateCustomerToCheckout(
          checkoutId,
          accessToken
        );
        if (assosiateResponse?.email)
          console.error('Could not associate user to checkout', assosiateResponse);
      } else {
        console.warn('Checkout id not fount');
      }

      return push(routes.account);
    } catch (error) {
      return showToast.error(error.message);
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <PageLayout title={seo.register.title} description={seo.register.description}>
      <PageBanner title={seo.register.title} />
      <Breadcrumbs />
      <FormContainer>
        <Form
          autoComplete="off"
          onSubmit={onSubmit}
          title={seo.register.title}
          requiredFields={['email', 'password', 'passwordConfirmation']}
        >
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
          <Input
            placeholder="Password Confirmation"
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            label="Password Confirmation"
            autoComplete="off"
            required="true"
          />
          <Input
            placeholder="First name"
            type="text"
            name="firstName"
            id="firstName"
            label="First name"
            autoComplete="off"
          />
          <Input
            placeholder="Last name"
            type="text"
            name="lastName"
            id="lastName"
            label="Last name"
            autoComplete="off"
          />
          <Buttons text="REGISTER">
            <Link href={routes.login}>LOGIN</Link>
          </Buttons>
        </Form>
      </FormContainer>
    </PageLayout>
  );
};

export default RegisterPage;
