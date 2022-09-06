import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import Dropdown from '@/components/Dropdown/Dropdown';
import styles from './LanguageSwitcher.module.scss';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');

  const { locales, pathname, query, asPath, locale, push } = useRouter();

  const handleClick = (index) => {
    const loc = locales[index];
    push({ pathname, query }, asPath, { locale: loc.toLowerCase() });
  };

  const handleLocaleFull = (loc) => {
    if (loc === 'en') return t('en');
    if (loc === 'fr') return t('fr');
    if (loc === 'es') return t('es');
    return t('en');
  };

  return (
    <div className={styles.container}>
      <Dropdown
        handleClick={handleClick}
        selected={handleLocaleFull(locale)}
        indexSelected={locales.findIndex((el) => el === locale)}
      >
        {Array.isArray(locales) && locales.map((loc) => handleLocaleFull(loc))}
      </Dropdown>
    </div>
  );
}
