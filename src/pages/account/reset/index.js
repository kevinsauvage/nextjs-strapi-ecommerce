import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import Button from '@/components/Button/Button';
import Form from '@/components/Form/Form';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import { UserContext } from '@/contexts/UserContext/UserContext';
import useForm from '@/hooks/useForm';
import routes from '@/data/routes';
import styles from './ResetPassword.module.scss';

function ResetPassword() {
  const { resetPasswordEmail, loading } = useContext(UserContext);
  const t = useTranslations('page.account.reset.email');

  const { handleInputChange, handleSubmit } = useForm(async (formData) => {
    const { email } = formData;
    resetPasswordEmail(email.trim());
  });

  return (
    <Page title={t('title')} loading={loading}>
      <div className={styles.ResetPassword}>
        <Form
          title={t('form.title')}
          subtitle={t('form.subtitle')}
          onSubmit={handleSubmit}
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
          <Button
            extraClass={styles.btn}
            type="submit"
            text="SEND ME AN EMAIL"
            tertiary
          />
          <div className={styles.backStore}>
            Or go back to <Link href={routes.base.login}>Login</Link>.
          </div>
        </Form>
      </div>
    </Page>
  );
}

export default ResetPassword;

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../locales/${locale}.json`)).default,
    },
  };
}
