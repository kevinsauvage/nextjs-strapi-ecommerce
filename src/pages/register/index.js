import Link from 'next/link';
import Button from '@/components/Button/Button';
import Container from '@/components/Container/Container';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import useForm from '@/hooks/useForm';
import Form from '@/components/Form/Form';
import routes from '@/data/routes';
import useUserContext from '@/contexts/UserContext/useUserContext';
import styles from './Register.module.scss';

function RegisterPage() {
  const { register, loading } = useUserContext();

  const onSubmit = async (formData) => {
    const { email, password } = formData;
    register(email.trim(), password.trim());
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title="Register your account" loading={loading}>
      <Container>
        <div className={styles.register}>
          <Form
            onSubmit={handleSubmit}
            title="CREATE ACCOUNT"
            subtitle="Please complete the form below to create an account"
          >
            <Input
              id="email"
              label="Email address"
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
            <Input
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              label="Password"
              autoComplete="current-password"
              onChange={handleInputChange}
            />
            <Button
              extraClass={styles.btn}
              text="Register"
              type="submit"
              tertiary
            />
            <div className={styles.alreadyRegistered}>
              Already have an account?{' '}
              <Link href={routes.base.login}>Login</Link> now.
            </div>
          </Form>
        </div>
      </Container>
    </Page>
  );
}

export default RegisterPage;
