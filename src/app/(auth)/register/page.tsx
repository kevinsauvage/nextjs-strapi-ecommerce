import type { Metadata } from 'next';
import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import config from '@/config';
import seo from '@/data/seo';
import { generateMetadata as generateMetadataUtil } from '@/utils/metadata';

import FormContainer from '../_components/FormContainer';
import RegisterForm from './_components/RegisterForm';

export const metadata: Metadata = generateMetadataUtil({
  title: seo.register.title,
  description: seo.register.description,
  url: config.routes.register,
  noindex: true, // Registration page shouldn't be indexed
});

const RegisterPage = () => {
  const { title, description } = seo.register;

  return (
    <div className="flex flex-col items-center justify-center">
      <PageBanner title={title} description={description}>
        <Breadcrumbs />
      </PageBanner>
      <FormContainer>
        <RegisterForm />
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href={config.routes.login} className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </FormContainer>
    </div>
  );
};

export default RegisterPage;
