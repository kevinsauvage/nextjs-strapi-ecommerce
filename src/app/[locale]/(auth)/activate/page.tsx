import type { Metadata } from 'next';

import AuthShell from '@/app/[locale]/(auth)/_components/AuthShell';
import Link from '@/components/LocalizedLink';
import config from '@/config';
import { getTranslations, localeFromParams, redirectToPath } from '@/i18n/server';
import { generateMetadata as generateMetadataUtil } from '@/lib/server/metadata';
import { isAllowedPasswordResetUrl } from '@/utils/url';

import ActivateForm from './_components/ActivateForm';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'auth');

  return generateMetadataUtil({
    title: t('activateTitle'),
    description: t('activateDescription'),
    url: config.routes.activate,
    noindex: true, // Account activation page shouldn't be indexed
    locale,
  });
};

const ActivatePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    activation_url: string;
    syclid?: string;
  }>;
}) => {
  const locale = await localeFromParams(params);
  const searchParameters = await searchParams;
  const { activation_url, syclid } = searchParameters;

  if (!activation_url) {
    redirectToPath(config.routes.login, locale);
  }

  // Rebuild the activation URL with the URL API so a crafted `syclid` cannot
  // inject extra query params. Activation links carry their token in the path,
  // so `syclid` is optional here (unlike the password-reset flow).
  let activationUrl: string;
  try {
    const url = new URL(activation_url);
    if (syclid) url.searchParams.set('syclid', syclid);
    activationUrl = url.toString();
  } catch {
    redirectToPath(config.routes.login, locale);
  }

  // Never render the form (or forward the URL to `customerActivateByUrl`) for
  // a link outside the store-owned origins: a crafted `activation_url` could
  // otherwise drive the victim's activation flow from a lookalike host.
  if (!isAllowedPasswordResetUrl(activationUrl)) {
    redirectToPath(config.routes.login, locale);
  }

  const t = getTranslations(locale, 'auth');

  return (
    <AuthShell
      title={t('activateTitle')}
      description={t('activateDescription')}
      locale={locale}
      footer={
        <div className="pt-4 text-body-sm text-center text-secondary">
          <Link href={config.routes.login} className="link">
            {t('backToLogin')}
          </Link>
        </div>
      }
    >
      <ActivateForm activationUrl={activationUrl} />
    </AuthShell>
  );
};

export default ActivatePage;
