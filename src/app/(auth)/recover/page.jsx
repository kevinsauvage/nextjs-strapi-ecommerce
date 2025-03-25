import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import FormContainer from '@/components/_forms/FormContainer/FormContainer';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import seo from '@/data/seo';

import RecoverForm from './_components/RecoverForm';

const ResetPassword = () => {
  return (
    <div>
      <PageBanner title={seo.recover.title} />
      <Breadcrumbs />
      <FormContainer>
        <RecoverForm />
      </FormContainer>
    </div>
  );
};

export default ResetPassword;
