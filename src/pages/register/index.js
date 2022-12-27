import Link from 'next/link';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import Form from '@/components/forms/Form/Form';
import config from '@/config/index';
import { toast } from 'react-toastify';
import nextApiCall from '@/utils/apiNext';
import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/forms/Buttons/Buttons';
import styles from './Register.module.scss';

const { userFeedback } = config;

function RegisterPage() {
  const { toggleLoading } = useGlobalContext();

  const { push } = useRouter();

  const onSubmit = async (formData) => {
    const { email, password } = formData;

    if (!password || password.length < 8) {
      return toast.error(config.userFeedback.passwordLength);
    }
    if (!email) return toast.error(userFeedback?.missingFields);

    toggleLoading(true);
    const registerRes = await nextApiCall.register({ email, password });
    toggleLoading(false);

    const userErrors = registerRes?.userErrors;
    if (userErrors?.length) {
      return userErrors.forEach((element) => toast.error(element.message));
    }

    if (registerRes?.ok) {
      toast.success(userFeedback?.register?.success);
      return push(config.routes.account);
    }
    return toast.error(userFeedback?.register?.error);
  };

  return (
    <Page title="Register your account">
      <div>
        <Form onSubmit={onSubmit} title="Create New Customer Account">
          <Input
            id="email"
            label="Email address"
            name="email"
            type="email"
            placeholder="Email"
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            id="password"
            label="Password"
            autoComplete="current-password"
          />
          <Buttons text="CREATE AN ACCOUNT" />
          <div className={styles.alreadyRegistered}>
            Already have an account?{' '}
            <Link href={config.routes.login}>LOGIN</Link> now.
          </div>
        </Form>
      </div>
    </Page>
  );
}

export default RegisterPage;
