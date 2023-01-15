import { useRouter } from 'next/router';
import Link from 'next/link';
import Input from '@/components/_scopes/forms/Input/Input';
import Form from '@/components/_scopes/forms/Form/Form';
import config from '@/config/index';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import Wrapper from '@/components/Wrapper/Wrapper';

const { userFeedback } = config;

function LoginPage() {
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const { reload } = useRouter();

  const onSubmit = async ({ email, password }) => {
    if (!email || !password)
      return showToast.error(userFeedback?.missingFields);
    toggleLoading(true);
    const resLogin = await nextApiCall.login({ email, password });

    toggleLoading(false);
    const customerUserErrors = resLogin?.customerUserErrors;
    if (customerUserErrors?.length) {
      console.log(customerUserErrors);
      return customerUserErrors.forEach((element) =>
        showToast.error(element.message)
      );
    }

    if (resLogin?.ok) {
      reload();
      return showToast.success(userFeedback.login.success);
    }

    return showToast.error(userFeedback.login.error);
  };

  return (
    <PageLayout title="User Login">
      <FormContainer>
        <Form onSubmit={onSubmit} title="Login">
          <Input
            id="email"
            label="Email address"
            type="email"
            name="email"
            placeholder="Email"
            required
            input="true"
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            id="password"
            label="Password"
            required
            input="true"
          />
          <Buttons text="Login">
            <Wrapper gap="6px">
              <Link href={config.routes.register}>REGISTER</Link> or
              <Link href={config.routes.emailResetPassword}>
                RESET PASSWORD
              </Link>
            </Wrapper>
          </Buttons>
        </Form>
      </FormContainer>
    </PageLayout>
  );
}

export default LoginPage;
