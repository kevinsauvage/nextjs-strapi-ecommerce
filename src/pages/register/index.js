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
    try {
      // check for password length
      if (!password || password.length < 8) {
        throw new Error(config.userFeedback.passwordLength);
      }

      // check for email
      if (!email) {
        throw new Error(userFeedback?.missingFields);
      }

      // toggle loading state
      toggleLoading(true);

      // perform registration call
      const registerRes = await nextApiCall.register({ email, password });

      // check for errors
      const userErrors = registerRes?.userErrors;
      if (userErrors?.length) {
        userErrors.forEach((element) => showToast.error(element.message));
        return;
      }

      // check if registration was successful
      if (registerRes?.ok) {
        showToast.success(userFeedback?.register?.success);
        push(config.routes.account);
      } else {
        throw new Error(userFeedback?.register?.error);
      }
    } catch (error) {
      showToast.error(error.message);
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
            input="true"
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
            input="true"
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
