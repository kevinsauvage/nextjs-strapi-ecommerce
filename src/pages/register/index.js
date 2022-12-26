import Link from 'next/link';
import Button from '@/components/Button/Button';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import Form from '@/components/forms/Form/Form';
import config from '@/config/index';
import { toast } from 'react-toastify';
import nextApiCall from '@/utils/apiNext';
import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import styles from './Register.module.scss';

const { userFeedback } = config;

function RegisterPage() {
  const { toggleLoading } = useGlobalContext();

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
    if (userErrors?.length) {
      return userErrors.forEach((element) => toast.error(element.message));
    }

    if (registerRes?.ok) {
      toast.success(userFeedback?.register?.success);
      return push(config.routes.account);
    }
    return toast.error(userFeedback?.register?.error);
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page
      title="Register your account"
      bannerTitle="Register your account"
      bannerDescription="Welcome to our ecommerce site! We are so glad you decided to join us. By creating an account, you will be able to fully experience all that our site has to offer, such as fast and easy checkouts, the ability to track your orders and shipments, and the option to save your preferences for future visits. Plus, registering helps keep your account secure and personalized just for you. Thank you for choosing us, and we can't wait to see you again soon!"
    >
      <div>
        <Form onSubmit={handleSubmit} title="REGISTER">
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
