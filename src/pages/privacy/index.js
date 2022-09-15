import { useTranslations } from 'next-intl';
import Page from '@/components/Page/Page';
import styles from './Privacy.module.scss';

function PrivacyPage() {
  const t = useTranslations('page.privacy');

  return (
    <Page title={t('title')}>
      <div className={styles.privacy} />
    </Page>
  );
}

export default PrivacyPage;

export const getStaticProps = async ({ locale }) => ({
  props: {
    messages: (await import(`../../locales/${locale}.json`)).default,
  },
});
