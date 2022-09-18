import Link from 'next/link';
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

  const { handleInputChange, handleSubmit } = useForm(async (formData) => {
    const { email } = formData;
    resetPasswordEmail(email.trim());
  });

  return (
    <Page title="Password recovery" loading={loading}>
      <div className={styles.ResetPassword}>
        <Form
          title="RESET YOUR PASSWORD"
          subtitle="Enter your email address below to receive an email to reset your password"
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
