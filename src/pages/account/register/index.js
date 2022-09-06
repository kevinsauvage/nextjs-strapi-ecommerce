import { useRouter } from 'next/router';
import { useContext } from 'react';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import Container from '@/components/Container/Container';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import { messages } from '@/config/i18n';
import useForm from '@/hooks/useForm';
import Form from '@/components/Form/Form';
import { UserContext } from '@/contexts/UserContext/UserContext';
import styles from './Register.module.scss';

function RegisterPage() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  const { register } = useContext(UserContext);

  const onSubmit = async (formData) => {
    const { email, password } = formData;
    register(email.trim(), password.trim());
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title="Register">
      <Container>
        <div className={styles.register}>
          <Form
            className={styles.form}
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
              required
            />

            <Input
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              label="Password"
              autoComplete="current-password"
              onChange={handleInputChange}
              required
            />

            <Button text="Register" type="submit" tertiary />

            <div>
              Already have an account? <Link href="/">Login</Link> now.
            </div>
          </Form>
        </div>
      </Container>
    </Page>
  );
}

export default RegisterPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
