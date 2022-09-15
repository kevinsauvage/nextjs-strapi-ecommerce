import Page from '@/components/Page/Page';
import { useTranslations } from 'next-intl';
import styles from './About.module.scss';

function AboutPage() {
  const t = useTranslations('page.about');

  return (
    <Page title={t('title')}>
      <div className={styles.about} />
    </Page>
  );
}

export default AboutPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
