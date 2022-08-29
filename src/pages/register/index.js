import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Button from '../../components/Button/Button';
import Container from '../../components/Container/Container';
import Input from '../../components/Input/Input';
import Page from '../../components/Page/Page';
import { messages } from '../../config/i18n';
import { UserContext } from '../../contexts/UserContext/UserContext';
import useForm from '../../hooks/useForm';
import styles from './Register.module.scss';

function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const { register } = useContext(UserContext);

  if (router.isFallback) return <div>Loading product...</div>;

  const onSubmit = async (formData) => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setErrorMessage('Fill in missing required fields');
      return;
    }

    const userData = {
      username: `${formData.firstName} ${formData.lastName} / ${formData.email}`,
      email: formData.email,
      password: formData.password,
    };

    await register(userData);
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
              placeholder="First Name"
              name="firstName"
              id="firstName"
              label="First Name"
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Last Name"
              name="lastName"
              id="LastName"
              label="Last Name"
              onChange={handleInputChange}
              required
            />
            <Input
              id="email"
              label="Email address"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              required
            />
            <Input
              placeholder="Password"
              name="password"
              id="password"
              label="Password"
              onChange={handleInputChange}
              required
            />
            <p>{errorMessage}</p>
            <Button text="Register" type="submit" tertiary />
          </form>
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
