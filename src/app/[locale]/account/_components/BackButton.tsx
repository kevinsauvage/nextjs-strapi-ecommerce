import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import config from '@/config';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/routing';
import { getTranslations } from '@/i18n/server';

import { ArrowLeft } from 'lucide-react';

// Rendered inside loading skeletons as well as pages: callers with a locale
// pass it, otherwise the label falls back to the default language.
const BackButton: React.FC<{ locale?: Locale }> = ({ locale = DEFAULT_LOCALE }) => {
  const t = getTranslations(locale, 'account');

  return (
    <Button variant="secondary" asChild>
      <Link href={config.routes.account} className="flex items-center gap-2">
        <ArrowLeft size={16} />
        {t('backToAccount')}
      </Link>
    </Button>
  );
};

export default BackButton;
