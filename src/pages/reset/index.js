import Form from '@/components/_scopes/forms/Form/Form';
import Input from '@/components/_scopes/forms/Input/Input';
import config from '@/config/index';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import BackButton from '@/components/BackButton/BackButton';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import { handleSetTokenCookies } from '@/helpers/cookies';
import getClient from '@/shopify/index';

function Password({ resetUrl }) {
  const { push, query } = useRouter();
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const onSubmit = async (formData) => {
    const { password } = formData;
    if (!password || password.length < 8) return showToast.error(config.userFeedback.passwordLength);
    toggleLoading(true);

    const resetRes = await getClient().customer.customerResetByUrl(password, resetUrl);

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
    <PageLayout title="Password recovery">
      <FormContainer>
        <Form title="Reset Password" onSubmit={onSubmit} requiredFields={['password']}>
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
}

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
