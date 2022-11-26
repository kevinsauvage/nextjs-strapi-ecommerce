import Link from 'next/link';
import Button from '@/components/Button/Button';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import Form from '@/components/forms/Form/Form';
import useUserContext from '@/contexts/UserContext/useUserContext';
import config from '@/config/index';
import styles from './Register.module.scss';

function RegisterPage() {
  const { register } = useUserContext();

  const onSubmit = async (formData) => {
    const { email, password } = formData;
    register(email?.trim(), password?.trim());
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title="Register your account">
      <div>
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
          <Button width="100%" text="Register" type="submit" tertiary />
          <div className={styles.alreadyRegistered}>
            Already have an account?{' '}
            <Link href={config.routes.login}>Login</Link> now.
          </div>
        </Form>
      </div>
    </Page>
  );
}

export default RegisterPage;
