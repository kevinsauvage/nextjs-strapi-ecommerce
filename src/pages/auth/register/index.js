import Link from 'next/link';
import Button from '@/components/Button/Button';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import Form from '@/components/forms/Form/Form';
import useUserContext from '@/contexts/UserContext/useUserContext';
import config from '@/config/index';
import { toast } from 'react-toastify';
import nextApiCall from '@/utils/apiNext';
import { actions } from '@/contexts/UserContext/UserReducer';
import { useRouter } from 'next/router';
import styles from './Register.module.scss';

const { userFeedback } = config;

function RegisterPage() {
  const { toggleLoading, handleError, dispatch } = useUserContext();

  const { push } = useRouter();

  const onSubmit = async (formData) => {
    const { email, password } = formData;

    if (!password || password.length < 8) {
      return toast.error(config.userFeedback.passwordLength);
    }
    if (!email) return toast.error(userFeedback?.missingFields);

    toggleLoading(true);
    const registerRes = await nextApiCall.register({ email, password });
    toggleLoading(false);
    const userErrors = registerRes?.userErrors;
    if (userErrors?.length) return handleError(userErrors);
    const customer = registerRes?.customer;
    if (customer?.id) {
      toast.success(userFeedback?.register?.success);
      dispatch({ type: actions.ADD_USER, payload: customer });
      return push(config.routes.account);
    }
    return toast.error(userFeedback?.register?.error);
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title="Register your account">
      <div>
        <Form
          onSubmit={handleSubmit}
          title="CREATE ACCOUNT"
          subtitle="Please complete the form below to create an account"
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
          <Button width="100%" text="Register" type="submit" tertiary />
          <div className={styles.alreadyRegistered}>
            Already have an account?{' '}
            <Link href={config.routes.login}>Login</Link> now.
          </div>
        </Form>
      </div>
    </Page>
  );
}

export default RegisterPage;
