import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Input from '@/components/_scopes/forms/Input/Input';
import Form from '@/components/_scopes/forms/Form/Form';
import config from '@/config/index';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import PageLayout from '@/layout/PageLayout/PageLayout';
import styles from './Login.module.scss';

const { userFeedback } = config;

function LoginPage() {
  const { toggleLoading } = useGlobalContext();

  const { reload } = useRouter();

  const onSubmit = async ({ email, password }) => {
    if (!email || !password) return toast.error(userFeedback?.missingFields);
    toggleLoading(true);
    const resLogin = await nextApiCall.login({ email, password });

    console.log('🚀 ~ file: index.js:26 ~ onSubmit ~ resLogin', resLogin);

    toggleLoading(false);
    const customerUserErrors = resLogin?.customerUserErrors;
    if (customerUserErrors?.length) {
      return customerUserErrors.forEach((element) =>
        toast.error(element.message)
      );
    }

    if (resLogin?.ok) {
      reload();
      return toast.success(userFeedback.login.success);
    }
    return toast.error(userFeedback.login.error);
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
            <div className={styles.register}>
              <Link href={config.routes.register}>REGISTER</Link>
            </div>
          </Buttons>
          <div className={styles.forgotPassword}>
            Forget your password ?{' '}
            <Link href={config.routes.emailResetPassword}>RESET PASSWORD</Link>
          </div>
        </Form>
      </FormContainer>
    </PageLayout>
  );
}

export default LoginPage;
