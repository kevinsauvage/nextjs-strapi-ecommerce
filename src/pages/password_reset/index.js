import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import Container from '@/components/Container/Container';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import useForm from '@/hooks/useForm';
import styles from './PasswordReset.module.scss';

function PasswordReset() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (formData) => {
    const { email } = formData;

    if (!email) {
      setErrorMessage('Fill in missing required fields');
    }
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title="Register">
      <Container>
        <div className={styles.register}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.title}>CREATE ACCOUNT</h1>
            <h2 className={styles.subtitle}>
              Please complete the form below to create an account
            </h2>

            <Input
              id="email"
              label="Email address"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              required
            />

            <p>{errorMessage}</p>
            <Button text="Register" type="submit" tertiary />
            <div>
              Don&apos;t have an account? <Link to="/register">Register</Link>{' '}
              now.
            </div>
          </form>
        </div>
      </Container>
    </Page>
  );
}

export default PasswordReset;
