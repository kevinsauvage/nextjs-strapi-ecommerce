import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import Page from '@/components/Page/Page';
import styles from './Terms.module.scss';

function TermsPage() {
  const router = useRouter();

  if (router.isFallback) return <div>Loading product...</div>;
  const t = useTranslations('page.terms');

  return (
    <Page title={t('title')}>
      <div className={styles.terms} />
    </Page>
  );
}

export default TermsPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
