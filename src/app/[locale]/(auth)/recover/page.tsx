import type { Metadata } from 'next';

import AuthShell from '@/app/[locale]/(auth)/_components/AuthShell';
import Link from '@/components/LocalizedLink';
import config from '@/config';
import { getTranslations, localeFromParams } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';

import RecoverForm from './_components/RecoverForm';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'auth');

  return generateMetadataUtil({
    title: t('recoverTitle'),
    description: t('recoverDescription'),
    url: config.routes.emailResetPassword,
    noindex: true, // Password recovery page shouldn't be indexed
    locale,
  });
};

const ResetPassword = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'auth');

  return (
    <AuthShell
      title={t('recoverTitle')}
      description={t('recoverDescription')}
      locale={locale}
      footer={
        <div className="pt-4 text-body-sm text-center text-secondary">
          {t('rememberedPassword')}{' '}
          <Link href={config.routes.login} className="link">
            {t('backToLogin')}
          </Link>
        </div>
      }
    >
      <RecoverForm />
    </AuthShell>
  );
};

export default ResetPassword;
