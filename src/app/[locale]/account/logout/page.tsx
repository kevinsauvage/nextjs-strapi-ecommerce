import SpinnerLoader from '@/components/SpinnerLoader';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslations, localeFromParams } from '@/i18n/server';

import LogoutClientEffect from './_components/LogoutClientEffect';

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'account');

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <SpinnerLoader size="md" />
        <p className="text-body text-secondary">{t('signingOut')}</p>
        <LogoutClientEffect />
      </CardContent>
    </Card>
  );
};

export default Page;
