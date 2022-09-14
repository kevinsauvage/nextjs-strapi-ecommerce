import { useRouter } from 'next/router';
import { useContext } from 'react';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import Container from '@/components/Container/Container';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import useForm from '@/hooks/useForm';
import Form from '@/components/Form/Form';
import { UserContext } from '@/contexts/UserContext/UserContext';
import routes from '@/data/routes';
import { useTranslations } from 'next-intl';
import styles from './Register.module.scss';

function RegisterPage() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;
  const t = useTranslations('page.account.auth.register');

  const { register, loading } = useContext(UserContext);

  const onSubmit = async (formData) => {
    const { email, password } = formData;
    register(email.trim(), password.trim());
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title={t('title')} loading={loading}>
      <Container>
        <div className={styles.register}>
          <Form
            onSubmit={handleSubmit}
            title={t('form.title')}
            subtitle={t('form.subtitle')}
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

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../../locales/${locale}.json`)).default,
    },
  };
}
