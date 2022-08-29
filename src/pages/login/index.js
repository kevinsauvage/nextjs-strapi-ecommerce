import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Button from '../../components/Button/Button';
import Container from '../../components/Container/Container';
import Input from '../../components/Input/Input';
import Page from '../../components/Page/Page';
import { messages } from '../../config/i18n';
import { UserContext } from '../../contexts/UserContext/UserContext';
import useForm from '../../hooks/useForm';
import styles from './Login.module.scss';

function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(UserContext);

  if (router.isFallback) return <div>Loading product...</div>;

  const onSubmit = async (formData) => {
    try {
      if (!formData.email || !formData.password) return;

      const userData = {
        email: formData.email,
        password: formData.password,
      };

      await login(userData);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title="login">
      <Container>
        <div className={styles.login}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.title}>LOGIN TO YOUR ACCOUNT</h2>
            <h3 className={styles.subtitle}>
              Please complete the form below to login to your account
            </h3>
            <Input
              id="email"
              label="Email address"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
            <Input
              placeholder="Password"
              name="password"
              id="password"
              label="Password"
              onChange={handleInputChange}
            />
            <p>{errorMessage}</p>
            <Button text="Login" type="submit" tertiary />
          </form>
        </div>
      </Container>
    </Page>
  );
}

export default LoginPage;

export const getStaticProps = (ctx) => ({
  props: {
    messages: messages[ctx.locale],
  },
});
