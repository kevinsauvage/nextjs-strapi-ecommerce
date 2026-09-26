import Link from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import config from '@/config';
import { DEFAULT_LOCALE } from '@/i18n/routing';
import { getTranslations } from '@/i18n/server';

import { ArrowLeft } from 'lucide-react';

// Rendered inside loading skeletons as well as pages, so it uses the default
// language rather than threading a locale through every caller.
const t = getTranslations(DEFAULT_LOCALE, 'account');

const BackButton: React.FC = () => (
  <Button variant="secondary" asChild>
    <Link href={config.routes.account} className="flex items-center gap-2">
      <ArrowLeft size={16} />
      {t('backToAccount')}
    </Link>
  </Button>
);

export default BackButton;
