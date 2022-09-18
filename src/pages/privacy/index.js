import Page from '@/components/Page/Page';
import styles from './Privacy.module.scss';

function PrivacyPage() {
  return (
    <Page title="Our privacy policy">
      <div className={styles.privacy} />
    </Page>
  );
}

export default PrivacyPage;
