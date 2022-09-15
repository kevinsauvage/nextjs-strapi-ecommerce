import Link from 'next/link';
import { useContext } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import Form from '@/components/Form/Form';
import Container from '@/components/Container/Container';
import useForm from '@/hooks/useForm';
import { UserContext } from '@/contexts/UserContext/UserContext';
import routes from '@/data/routes';
import styles from './Login.module.scss';

function LoginPage() {
  const { login, loading } = useContext(UserContext);
  const t = useTranslations('page.account.auth.login');

  const { handleInputChange, handleSubmit } = useForm((formData) =>
    login(formData.email, formData.password)
  );

  return (
    <Page title={t('title')} loading={loading}>
      <Container>
        <div className={styles.login}>
          <Form
            title={t('form.title')}
            subtitle={t('form.subtitle')}
            onSubmit={(e) => handleSubmit(e)}
          >
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
            <Button
              extraClass={styles.btn}
              text="Login"
              type="submit"
              tertiary
            />
            <div className={styles.forgotPassword}>
              <Link href={routes.base.resetPassword}>Reset Password</Link>
            </div>
            <div className={styles.register}>
              Don&apos;t have an account?{' '}
              <Link href={routes.base.register}>Register</Link> now.
            </div>
          </Form>
        </div>
      </Container>
    </Page>
  );
}

export default LoginPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../../locales/${locale}.json`)).default,
    },
  };
}
