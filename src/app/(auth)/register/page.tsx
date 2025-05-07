import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';

import RegisterForm from './_components/RegisterForm';

const RegisterPage = () => {
  const { title, description } = seo.register;

  return (
    <div className="flex flex-col items-center justify-center">
      <PageBanner title={title} description={description}>
        <Breadcrumbs />
      </PageBanner>
      <div className="bg-white dark:bg-black w-full">
        <div className="bg-gray-100 w-full pb-12 dark:bg-background/70">
          <RegisterForm />
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
