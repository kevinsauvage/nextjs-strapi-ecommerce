import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import FormContainer from '@/components/_forms/FormContainer/FormContainer';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import seo from '@/data/seo';

import RegisterForm from './_components/RegisterForm';

const RegisterPage = () => {
  return (
    <div>
      <PageBanner title={seo.register.title} />
      <Breadcrumbs />
      <FormContainer>
        <RegisterForm />
      </FormContainer>
    </div>
  );
};

export default RegisterPage;
