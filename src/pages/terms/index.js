import Page from '@/components/Page/Page';
import styles from './Terms.module.scss';

function TermsPage() {
  return (
    <Page title="Our terms and conditions">
      <div className={styles.terms} />
    </Page>
  );
}

export default TermsPage;
