import { useRouter } from 'next/router';
import Page from '@/components/Page/Page';
import styles from './About.module.scss';

function AboutPage() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <Page title="About Us">
      <div className={styles.about} />
    </Page>
  );
}

export default AboutPage;

export async function getStaticProps({ locale }) {
  return {
    props: {},
  };
}
