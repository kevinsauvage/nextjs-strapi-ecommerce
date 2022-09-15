import Page from '@/components/Page/Page';
import { useTranslations } from 'next-intl';
import styles from './Search.module.scss';

function Search() {
  const t = useTranslations('page.search');

  return (
    <Page title={t('title')}>
      <div className={styles.search}>search</div>
    </Page>
  );
}

export default Search;

export const getStaticProps = async ({ locale }) => ({
  props: {
    messages: (await import(`../../locales/${locale}.json`)).default,
  },
});
