import { useRouter } from 'next/router';
import { useContext } from 'react';
import Button from '@/components/Button/Button';
import Form from '@/components/Form/Form';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import { messages } from '@/config/i18n';
import { UserContext } from '@/contexts/UserContext/UserContext';
import useForm from '@/hooks/useForm';
import styles from './ResetPassword.module.scss';

function ResetPassword() {
  const router = useRouter();
  const { resetPassword } = useContext(UserContext);

  if (router.isFallback) return <div>Loading product...</div>;

  const { handleInputChange, handleSubmit } = useForm(async (formData) => {
    const { email } = formData;
    resetPassword(email.trim());
  });
  return (
    <Page title="Search">
      <div className={styles.ResetPassword}>
        <Form title="Reset your password" onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email address"
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleInputChange}
            required
          />

          <Button type="submit" text="SEND ME AN EMAIL" />
        </Form>
      </div>
    </Page>
  );
}

export default ResetPassword;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
