import { useEffect } from 'react';
import { useRouter } from 'next/router';

import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import Form from '@/components/_scopes/forms/Form/Form';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import Input from '@/components/_scopes/forms/Input/Input';
import BackButton from '@/components/BackButton/BackButton';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import seo from '@/data/seo';
import { handleSetTokenCookies } from '@/helpers/cookies';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

const Password = ({ resetUrl }) => {
  const { push, query } = useRouter();
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const onSubmit = async (formData) => {
    const { password } = formData;
    if (!password || password.length < 8) return showToast.error(config.userFeedback.passwordLength);
    toggleLoading(true);

    const resetRes = await getClient().storefront.customer.customerResetByUrl({ password, resetUrl });

    toggleLoading(false);

    const accessToken = resetRes?.customerAccessToken?.accessToken;
    const customerUserErrors = resetRes?.customerUserErrors;

    if (accessToken) {
      showToast.success(config.userFeedback.resetPassword.success);
      handleSetTokenCookies(accessToken);
      return push(config.routes.account);
    }

    if (customerUserErrors?.length) {
      return customerUserErrors.forEach((element) => showToast.error(element.message));
    }

    return showToast.error(config.userFeedback.resetPassword.error);
  };

  useEffect(() => {
    if (query.reset_url) push(config.routes.resetPassword, undefined, { shallow: true });
  }, [push, query]);

  useEffect(() => {
    if (!resetUrl) push(config.routes.login);
  }, [resetUrl, push]);

  return (
    <PageLayout title={seo.reset.title} description={seo.reset.description}>
      <PageBanner title={seo.reset.title} />
      <Breadcrumbs />
      <FormContainer>
        <Form title={seo.reset.title} onSubmit={onSubmit} requiredFields={['password']}>
          <Input
            id="password"
            label="New password"
            name="password"
            type="password"
            placeholder="New password"
            input="true"
            required="true"
          />
          <Buttons text="RESET PASSWORD">
            <BackButton />
          </Buttons>
        </Form>
      </FormContainer>
    </PageLayout>
  );
};

export default Password;

export async function getServerSideProps({ query }) {
  if (!query.reset_url) {
    return {
      redirect: {
        destination: config.routes.login,
        permanent: false,
      },
    };
  }

  return {
    props: {
      resetUrl: query.reset_url,
    },
  };
}
