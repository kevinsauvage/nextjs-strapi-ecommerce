import { Suspense } from 'react';
import type { Metadata } from 'next';

import AuthShell from '@/app/[locale]/(auth)/_components/AuthShell';
import Link from '@/components/LocalizedLink';
import config from '@/config';
import { getTranslations, localeFromParams } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';

import LoginForm from './_components/LoginForm';

/**
 * The locale is part of the route, so the canonical URL and the `hreflang`
 * alternates have to be resolved per language rather than declared statically.
 */
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'auth');

  return generateMetadataUtil({
    title: t('loginTitle'),
    description: t('loginDescription'),
    url: config.routes.login,
    noindex: true, // Login page shouldn't be indexed
    locale,
  });
};

const LoginPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'auth');

  return (
    <AuthShell
      title={t('loginTitle')}
      description={t('loginDescription')}
      locale={locale}
      footer={
        <div className="pt-4 space-y-3 text-body-sm text-center text-secondary">
          <div>
            {t('noAccount')}{' '}
            <Link href={config.routes.register} className="link">
              {t('signUp')}
            </Link>
          </div>
          <div>
            <Link href={config.routes.emailResetPassword} className="link">
              {t('forgotPassword')}
            </Link>
          </div>
        </div>
      }
    >
      <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
};

export default LoginPage;
