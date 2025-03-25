import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import FormContainer from '@/components/_forms/FormContainer/FormContainer';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import seo from '@/data/seo';

import LoginForm from './_components/LoginForm';

const LoginPage = () => {
  return (
    <div>
      <PageBanner title={seo.login.title} />
      <Breadcrumbs />
      <FormContainer>
        <LoginForm />
      </FormContainer>
    </div>
  );
};

export default LoginPage;
