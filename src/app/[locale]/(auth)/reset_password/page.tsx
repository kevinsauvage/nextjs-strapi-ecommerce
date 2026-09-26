import type { Metadata } from 'next';

import AuthShell from '@/app/[locale]/(auth)/_components/AuthShell';
import Link from '@/components/LocalizedLink';
import config from '@/config';
import { getTranslations, localeFromParams, redirectToPath } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { isAllowedPasswordResetUrl } from '@/utils/url';

import ResetForm from './_components/ResetPasswordForm';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'auth');

  return generateMetadataUtil({
    title: t('resetTitle'),
    description: t('resetDescription'),
    url: config.routes.emailResetPassword,
    noindex: true, // Password reset page shouldn't be indexed
    locale,
  });
};

const ResetPasswordPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    reset_url: string;
    syclid: string;
  }>;
}) => {
  const locale = await localeFromParams(params);
  const searchParameters = await searchParams;
  const { reset_url, syclid } = searchParameters;

  if (!reset_url || !syclid) {
    redirectToPath(config.routes.login, locale);
  }

  // Build the reset URL with the URL API so a crafted `syclid` cannot inject
  // extra query params (or break the link when `reset_url` already has its own).
  // An unparseable `reset_url` bounces to login via the allowlist check below.
  let resetUrl: string;
  try {
    const url = new URL(reset_url);
    url.searchParams.set('syclid', syclid);
    resetUrl = url.toString();
  } catch {
    redirectToPath(config.routes.login, locale);
  }

  // Never render the form (or forward the URL to `customerResetByUrl`) for a
  // reset link outside the store-owned origins: a crafted `reset_url` could
  // otherwise drive the victim's reset flow from a lookalike host.
  if (!isAllowedPasswordResetUrl(resetUrl)) {
    redirectToPath(config.routes.login, locale);
  }
  const t = getTranslations(locale, 'auth');

  return (
    <AuthShell
      title={t('resetTitle')}
      description={t('resetDescription')}
      locale={locale}
      footer={
        <div className="pt-4 text-body-sm text-center text-secondary">
          <Link href={config.routes.login} className="link">
            {t('backToLogin')}
          </Link>
        </div>
      }
    >
      <ResetForm resetUrl={resetUrl} />
    </AuthShell>
  );
};

export default ResetPasswordPage;
