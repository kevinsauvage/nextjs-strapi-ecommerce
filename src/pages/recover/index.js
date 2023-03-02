import Form from '@/components/_scopes/forms/Form/Form';
import Input from '@/components/_scopes/forms/Input/Input';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import BackButton from '@/components/BackButton/BackButton';
import PageLayout from '@/layout/PageLayout/PageLayout';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import getClient from '@/shopify/index';
import seo from '@/data/seo';

function ResetPassword() {
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const onSubmit = async (formData) => {
    const { email } = formData;
    if (!email) return showToast.error(config.userFeedback?.missingFields);
    toggleLoading(true);
    const recoverRes = await getClient().storefront.customer.customerRecover({ email });

    toggleLoading(false);
    const errors = recoverRes?.customerUserErrors || recoverRes?.errors;
    if (errors?.length) return errors.forEach((element) => showToast.error(element.message));
    return showToast.success(config.userFeedback.sendRecoverEmail.success);
  };

  return (
    <PageLayout title={seo.recover.title} description={seo.recover.description}>
      <FormContainer>
        <Form title="Password Recovery" onSubmit={onSubmit} requiredFields={['email']}>
          <Input
            id="email"
            label="Email address"
            name="email"
            type="email"
            placeholder="Email"
            required="true"
            input="true"
          />
          <Buttons text="SEND EMAIL">
            <BackButton />
          </Buttons>
        </Form>
      </FormContainer>
    </PageLayout>
  );
}

export default ResetPassword;
