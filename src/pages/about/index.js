import Page from '@/components/Page/Page';
import styles from './About.module.scss';

function AboutPage() {
  return (
    <Page title="About Us">
      <div className={styles.about} />
    </Page>
  );
}

export default AboutPage;
