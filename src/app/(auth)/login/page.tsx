import type { Metadata } from 'next';
import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import config from '@/config';
import seo from '@/data/seo';
import { generateMetadata as generateMetadataUtil } from '@/utils/metadata';

import FormContainer from '../_components/FormContainer';
import LoginForm from './_components/LoginForm';

export const metadata: Metadata = generateMetadataUtil({
  title: seo.login.title,
  description: seo.login.description,
  url: config.routes.login,
  noindex: true, // Login page shouldn't be indexed
});

const LoginPage = () => {
  const { title, description } = seo.login || {};
  return (
    <div className="flex flex-col items-center justify-center ">
      <PageBanner title={title} description={description}>
        <Breadcrumbs />
      </PageBanner>
      <FormContainer>
        <LoginForm />
        <div className="text-sm text-center text-muted-foreground ">
          Don&apos;t have an account?{' '}
          <Link href={config.routes.register} className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
        <div className="text-sm text-center text-muted-foreground ">
          <Link href={config.routes.emailResetPassword} className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
      </FormContainer>
    </div>
  );
};

export default LoginPage;
