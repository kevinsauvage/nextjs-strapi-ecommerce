import { useRouter } from 'next/router';
import Page from '@/components/Page/Page';
import { messages } from '@/config/i18n';
import styles from './Search.module.scss';

function Search() {
  const router = useRouter();

  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <Page title="Search">
      <div className={styles.search} />
    </Page>
  );
}

export default Search;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
