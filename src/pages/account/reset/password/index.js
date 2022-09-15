import { useContext } from 'react';
import Button from '@/components/Button/Button';
import Form from '@/components/Form/Form';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import { UserContext } from '@/contexts/UserContext/UserContext';
import useForm from '@/hooks/useForm';
import routes from '@/data/routes';
import { useTranslations } from 'next-intl';
import styles from './password.module.scss';

function Password({ resetUrl }) {
  const { resetPassword, loading } = useContext(UserContext);

  const t = useTranslations('page.account.reset.password');

  const { handleInputChange, handleSubmit } = useForm(async (formData) => {
    const { password } = formData;
    resetPassword(password.trim(), resetUrl);
  });

  return (
    <Page title={t('title')} loading={loading}>
      <div className={styles.password}>
        <Form
          title={t('form.title')}
          subtitle={t('form.subtitle')}
          onSubmit={handleSubmit}
        >
          <Input
            id="password"
            label="New password"
            name="password"
            type="password"
            placeholder="New password"
            onChange={handleInputChange}
          />
          <Button
            extraClass={styles.btn}
            type="submit"
            text="RESET PASSWORD"
            tertiary
          />
        </Form>
      </div>
    </Page>
  );
}

export default Password;

export async function getServerSideProps({ query, res, locale }) {
  console.log(query);
  if (!query.reset_url) {
    res.setHeader('location', routes.base.login);
    res.statusCode = 302;
    res.end();
    return null;
  }

  return {
    props: {
      resetUrl: query.reset_url,
      messages: (await import(`../../../../locales/${locale}.json`)).default,
    },
  };
}
