import { useRouter } from 'next/router';
import Page from '@/components/Page/Page';
import { useTranslations } from 'next-intl';
import styles from './Search.module.scss';

function Search() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;
  const t = useTranslations('page.search');

  return (
    <Page title={t('title')}>
      <div className={styles.search} />
    </Page>
  );
}

export default Search;

export const getStaticProps = async ({ locale }) => ({
  props: {
    messages: (await import(`../../locales/${locale}.json`)).default,
  },
});
