import Link from 'next/link';
import Button from '@/components/Button/Button';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import Form from '@/components/forms/Form/Form';
import useForm from '@/hooks/useForm';
import useUserContext from '@/contexts/UserContext/useUserContext';
import config from '@/config/index';
import styles from './Login.module.scss';

function LoginPage() {
  const { login } = useUserContext();

  const { handleInputChange, handleSubmit } = useForm((formData) =>
    login(formData.email, formData.password)
  );

  return (
    <Page title="User Login">
      <div>
        <Form
          title="LOGIN TO YOUR ACCOUNT"
          subtitle="Please complete the form below to login to your account"
          onSubmit={(e) => handleSubmit(e)}
        >
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
            <Link href={config.routes.resetPassword}>Reset Password</Link>
          </div>
          <div className={styles.register}>
            Don&apos;t have an account?{' '}
            <Link href={config.routes.register}>Register</Link> now.
          </div>
        </Form>
      </div>
    </Page>
  );
}

export default LoginPage;
