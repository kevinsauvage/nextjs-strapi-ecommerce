import { useRouter } from 'next/router';
import { messages } from '@/config/i18n';
import Page from '@/components/Page/Page';
import styles from './Terms.module.scss';

function TermsPage() {
  const router = useRouter();

  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <Page title="Terms">
      <div className={styles.terms} />
    </Page>
  );
}

export default TermsPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
