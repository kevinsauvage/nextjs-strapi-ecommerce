import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import Form from '@/components/forms/Form/Form';
import useForm from '@/hooks/useForm';
import config from '@/config/index';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './Login.module.scss';

const { userFeedback } = config;

function LoginPage() {
  const { toggleLoading } = useGlobalContext();

  const { reload } = useRouter();

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
      toast.success(userFeedback.login.success);
      reload(config.routes.account);
      return true;
    }
    return toast.error(userFeedback.login.error);
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page
      title="User Login"
      bannerTitle="Login to your account"
      bannerDescription="We highly recommend logging into your account to get the most out of your shopping experience with us. This includes the ability to view your past orders, track your current shipments, and manage your preferences. Plus, logging in helps keep your account secure. Thank you for choosing us, and we hope you have a great time shopping with us!"
    >
      <Form onSubmit={(e) => handleSubmit(e)} title="LOGIN">
        <Input
          id="email"
          label="Email address"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
        />
        <Input
          placeholder="Password"
          type="password"
          name="password"
          id="password"
          label="Password"
          onChange={handleInputChange}
        />
        <Button width="100%" text="Login" type="submit" tertiary />
        <div className={styles.forgotPassword}>
          <Link href={config.routes.emailResetPassword}>Reset Password</Link>
        </div>
        <div className={styles.register}>
          Don&apos;t have an account?{' '}
          <Link href={config.routes.register}>Register</Link> now.
        </div>
      </Form>
    </Page>
  );
}

export default LoginPage;
