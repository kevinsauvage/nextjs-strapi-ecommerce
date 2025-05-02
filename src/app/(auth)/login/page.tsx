import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';

import LoginForm from './_components/LoginForm';

const LoginPage = () => {
  const { title, description } = seo.login || {};
  return (
    <div className="flex flex-col items-center justify-center ">
      <PageBanner title={title} description={description}>
        <Breadcrumbs />
      </PageBanner>
      <div className="bg-gray-100 w-full  pb-12 dark:bg-muted">
        <LoginForm />
        <div className="text-sm text-center text-muted-foreground ">
          Don’t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
