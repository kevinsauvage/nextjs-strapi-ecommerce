import { redirect } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import config from '@/config';
import seo from '@/data/seo';

import FormContainer from '../_components/FormContainer';

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
  const { title, description } = seo.reset || {};

  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs />
      </PageBanner>
      <FormContainer>
        <ResetForm resetUrl={resetUrl} />
      </FormContainer>
    </div>
  );
};

export default ResetPasswordPage;
