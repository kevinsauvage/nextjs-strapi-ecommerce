import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import Form from '@/components/_scopes/forms/Form/Form';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import Input from '@/components/_scopes/forms/Input/Input';
import BackButton from '@/components/BackButton/BackButton';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import seo from '@/data/seo';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

const ResetPassword = () => {
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
      <PageBanner title={seo.recover.title} />
      <Breadcrumbs />
      <FormContainer>
        <Form title={seo.recover.title} onSubmit={onSubmit} requiredFields={['email']}>
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
};

export default ResetPassword;
