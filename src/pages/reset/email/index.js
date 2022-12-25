import Link from 'next/link';
import Button from '@/components/Button/Button';
import Form from '@/components/forms/Form/Form';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import config from '@/config/index';
import { toast } from 'react-toastify';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './ResetPassword.module.scss';

function ResetPassword() {
  const { toggleLoading } = useGlobalContext();

  const { handleInputChange, handleSubmit } = useForm(async (formData) => {
    const { email } = formData;
    if (!email) return toast.error(config.userFeedback?.missingFields);
    toggleLoading(true);
    const recoverRes = await nextApiCall.sendRecoverEmail({ email });
    toggleLoading(false);
    const errors = recoverRes?.customerUserErrors || recoverRes?.errors;
    if (errors?.length) {
      return errors.forEach((element) => toast.error(element.message));
    }
    return toast.success(config.userFeedback.sendRecoverEmail.success);
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
