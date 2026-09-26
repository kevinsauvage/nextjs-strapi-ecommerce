import type { Metadata } from 'next';

import AuthShell from '@/app/[locale]/(auth)/_components/AuthShell';
import Link from '@/components/LocalizedLink';
import config from '@/config';
import { getTranslations, localeFromParams } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';

import RegisterForm from './_components/RegisterForm';

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
    title: t('registerTitle'),
    description: t('registerDescription'),
    url: config.routes.register,
    noindex: true, // Registration page shouldn't be indexed
    locale,
  });
};

const RegisterPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'auth');

  return (
    <AuthShell
      title={t('registerTitle')}
      description={t('registerDescription')}
      locale={locale}
      footer={
        <div className="pt-4 text-body-sm text-center text-secondary">
          {t('hasAccount')}{' '}
          <Link href={config.routes.login} className="link">
            {t('signIn')}
          </Link>
        </div>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
};

export default RegisterPage;
