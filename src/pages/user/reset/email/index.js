import Link from 'next/link';
import Button from '@/components/Button/Button';
import Form from '@/components/forms/Form/Form';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import useUserContext from '@/contexts/UserContext/useUserContext';
import config from '@/config/index';
import styles from './ResetPassword.module.scss';

function ResetPassword() {
  const { resetPasswordEmail } = useUserContext();

  const { handleInputChange, handleSubmit } = useForm(async (formData) => {
    const { email } = formData;
    resetPasswordEmail(email.trim());
  });

  return (
    <Page title="Password recovery">
      <div>
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
            extraStyles={{ width: '100%' }}
            type="submit"
            text="SEND ME AN EMAIL"
            tertiary
          />
          <div className={styles.backStore}>
            Or go back to <Link href={config.routes.login}>Login</Link>.
          </div>
        </Form>
      </div>
    </Page>
  );
}

export default ResetPassword;
