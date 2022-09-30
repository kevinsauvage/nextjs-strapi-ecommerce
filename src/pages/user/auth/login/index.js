import Link from 'next/link';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import Form from '@/components/Form/Form';
import Container from '@/components/Container/Container';
import useForm from '@/hooks/useForm';
import routes from '@/data/routes';
import useUserContext from '@/contexts/UserContext/useUserContext';
import styles from './Login.module.scss';

function LoginPage() {
  const { login, loading } = useUserContext();

  const { handleInputChange, handleSubmit } = useForm((formData) =>
    login(formData.email, formData.password)
  );

  return (
    <Page title="User Login" loading={loading}>
      <Container>
        <div className={styles.login}>
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
            <Button
              extraClass={styles.btn}
              text="Login"
              type="submit"
              tertiary
            />
            <div className={styles.forgotPassword}>
              <Link href={routes.resetPassword}>Reset Password</Link>
            </div>
            <div className={styles.register}>
              Don&apos;t have an account?{' '}
              <Link href={routes.register}>Register</Link> now.
            </div>
          </Form>
        </div>
      </Container>
    </Page>
  );
}

export default LoginPage;
