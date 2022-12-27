import Form from '@/components/forms/Form/Form';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import config from '@/config/index';
import { toast } from 'react-toastify';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/forms/Buttons/Buttons';

function ResetPassword() {
  const { toggleLoading } = useGlobalContext();

  const onSubmit = async (formData) => {
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
  };

  return (
    <Page title="Password recovery">
      <div>
        <Form title="Password recovery" onSubmit={onSubmit}>
          <Input
            id="email"
            label="Email address"
            name="email"
            type="email"
            placeholder="Email"
            required
          />
          <Buttons text="SEND ME AN EMAIL" />
        </Form>
      </div>
    </Page>
  );
}

export default ResetPassword;
