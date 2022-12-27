import Form from '@/components/forms/Form/Form';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import config from '@/config/index';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/forms/Buttons/Buttons';

function Password({ resetUrl }) {
  const { push, query } = useRouter();
  const { toggleLoading } = useGlobalContext();

  const onSubmit = async (formData) => {
    const { password } = formData;

    if (!password || password.length < 8) {
      return toast.error(config.userFeedback.passwordLength);
    }

    toggleLoading(true);

    const data = await nextApiCall.resetPassword(password, resetUrl);

    toggleLoading(false);

    const customerUserErrors = data?.customerUserErrors;

    if (customerUserErrors?.length) {
      return customerUserErrors.forEach((element) =>
        toast.error(element.message)
      );
    }
    if (data?.ok) {
      toast.success(config.userFeedback.resetPassword.success);
      return push(config.routes.account);
    }
    return toast.error(config.userFeedback.resetPassword.error);
  };

  useEffect(() => {
    if (query.reset_url) {
      push(config.routes.resetPassword, undefined, { shallow: true });
    }
  }, [push, query]);

  useEffect(() => {
    if (!resetUrl) push(config.routes.login);
  }, [resetUrl, push]);

  return (
    <Page title="Password recovery">
      <Form title="Reset your password" onSubmit={onSubmit}>
        <Input
          id="password"
          label="New password"
          name="password"
          type="password"
          placeholder="New password"
          input="true"
        />
        <Buttons text="RESET PASSWORD" />
      </Form>
    </Page>
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
