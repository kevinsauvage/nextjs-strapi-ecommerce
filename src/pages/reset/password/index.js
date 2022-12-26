import Button from '@/components/Button/Button';
import Form from '@/components/forms/Form/Form';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import config from '@/config/index';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';

function Password({ resetUrl }) {
  const { push, query } = useRouter();
  const { toggleLoading } = useGlobalContext();

  const { handleInputChange, handleSubmit } = useForm(async (formData) => {
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
  });

  useEffect(() => {
    if (query.reset_url) {
      push(config.routes.resetPassword, undefined, { shallow: true });
    }
  }, [push, query]);

  useEffect(() => {
    if (!resetUrl) push(config.routes.login);
  }, [resetUrl, push]);

  return (
    <Page
      title="Password recovery"
      bannerTitle="Reset your password"
      bannerDescription="Welcome to our password input page! Here you can enter your new password to complete the reset process. Please make sure to choose a strong, unique password that you won't forget. This will help keep your account secure and protect your personal information. If you have any issues or need further assistance, please don't hesitate to contact us. We are here to help and ensure that you can access your account safely and securely. Thank you for choosing us!"
    >
      <div>
        <Form title="NEW PASSWORD" onSubmit={handleSubmit}>
          <Input
            id="password"
            label="New password"
            name="password"
            type="password"
            placeholder="New password"
            onChange={handleInputChange}
          />
          <Button width="100%" type="submit" text="RESET PASSWORD" tertiary />
        </Form>
      </div>
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
