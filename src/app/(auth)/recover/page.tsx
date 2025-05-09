import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';

import FormContainer from '../_components/FormContainer';

import RecoverForm from './_components/RecoverForm';

const ResetPassword = () => {
  const { title, description } = seo.recover || {};
  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs />
      </PageBanner>
      <FormContainer>
        <RecoverForm />
      </FormContainer>
    </div>
  );
};

export default ResetPassword;
