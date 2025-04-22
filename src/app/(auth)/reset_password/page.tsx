import { redirect } from 'next/navigation';

import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import FormContainer from '@/components/_forms/FormContainer/FormContainer';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import config from '@/config';
import seo from '@/data/seo';

import ResetForm from './_components/ResetPasswordForm';

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    reset_url: string;
    syclid: string;
  }>;
}) => {
  const searchParameters = await searchParams;
  const { reset_url, syclid } = searchParameters;

  if (!reset_url || !syclid) {
    redirect(config.routes.login);
  }

  const resetUrl = `${reset_url}?syclid=${syclid}`;

  return (
    <div>
      <PageBanner title={seo.reset.title} />
      <Breadcrumbs />
      <FormContainer>
        <ResetForm resetUrl={resetUrl} />
      </FormContainer>
    </div>
  );
};

export default ResetPasswordPage;
