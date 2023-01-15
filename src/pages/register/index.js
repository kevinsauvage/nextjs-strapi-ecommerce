import Link from 'next/link';
import Input from '@/components/_scopes/forms/Input/Input';
import Form from '@/components/_scopes/forms/Form/Form';
import config from '@/config/index';
import nextApiCall from '@/utils/apiNext';
import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

const { userFeedback } = config;

function RegisterPage() {
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const { push } = useRouter();

  const onSubmit = async (formData) => {
    const { email, password } = formData;

    if (!password || password.length < 8) {
      return showToast.error(config.userFeedback.passwordLength);
    }
    if (!email) {
      return showToast.error(userFeedback?.missingFields);
    }

    toggleLoading(true);
    const registerRes = await nextApiCall.register({ email, password });
    toggleLoading(false);

    const userErrors = registerRes?.userErrors;
    if (userErrors?.length) {
      return userErrors.forEach((element) => showToast.error(element.message));
    }

    if (registerRes?.ok) {
      showToast.success(userFeedback?.register?.success);
      return push(config.routes.account);
    }
    return showToast.error(userFeedback?.register?.error);
  };

  return (
    <PageLayout title="Register your account">
      <FormContainer>
        <Form onSubmit={onSubmit} title="Register">
          <Input
            id="email"
            label="Email address"
            name="email"
            type="email"
            input="true"
            placeholder="Email"
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            id="password"
            label="Password"
            input="true"
            autoComplete="current-password"
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
