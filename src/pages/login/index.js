import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import Form from '@/components/forms/Form/Form';
import config from '@/config/index';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/forms/Buttons/Buttons';
import styles from './Login.module.scss';

const { userFeedback } = config;

function LoginPage() {
  const { toggleLoading } = useGlobalContext();

  const { push } = useRouter();

  const onSubmit = async ({ email, password }) => {
    if (!email || !password) return toast.error(userFeedback?.missingFields);
    toggleLoading(true);
    const resLogin = await nextApiCall.login({ email, password });
    toggleLoading(false);
    const customerUserErrors = resLogin?.customerUserErrors;
    if (customerUserErrors?.length) {
      return customerUserErrors.forEach((element) =>
        toast.error(element.message)
      );
    }

    if (resLogin?.ok) {
      push(config.routes.account);
      return toast.success(userFeedback.login.success);
    }
    return toast.error(userFeedback.login.error);
  };

  return (
    <Page title="User Login">
      <Form onSubmit={onSubmit} title="Login To You Account">
        <Input
          id="email"
          label="Email address"
          type="email"
          name="email"
          placeholder="Email"
          required
          input
        />
        <Input
          placeholder="Password"
          type="password"
          name="password"
          id="password"
          label="Password"
          required
          input
        />
        <Buttons text="Login" />
        <div className={styles.forgotPassword}>
          <Link href={config.routes.emailResetPassword}>RESET PASSWORD</Link>
        </div>
        <div className={styles.register}>
          <p>
            Don&apos;t have an account?
            <Link href={config.routes.register}> REGISTER</Link> now.
          </p>
        </div>
      </Form>
    </Page>
  );
}

export default LoginPage;
