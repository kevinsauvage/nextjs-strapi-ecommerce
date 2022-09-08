import { useRouter } from 'next/router';
import { messages } from '@/config/i18n';
import Page from '@/components/Page/Page';
import styles from './Privacy.module.scss';

function PrivacyPage() {
  const router = useRouter();

  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <Page title="Terms">
      <div className={styles.privacy} />
    </Page>
  );
}

export default PrivacyPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
