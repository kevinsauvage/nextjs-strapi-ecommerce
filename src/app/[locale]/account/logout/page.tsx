import SpinnerLoader from '@/components/SpinnerLoader';
import { Card, CardContent } from '@/components/ui/card';
import { DEFAULT_LOCALE } from '@/i18n/routing';
import { getTranslations } from '@/i18n/server';

import LogoutClientEffect from './_components/LogoutClientEffect';

// No route params here, so the message renders in the default language.
const t = getTranslations(DEFAULT_LOCALE, 'account');

const Page = () => {
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
