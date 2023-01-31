import { getPrivacyPolicy } from '@/lib/shopify/shop/shopApiCall';
import PageLayout from '@/layout/PageLayout/PageLayout';
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import styles from './Privacy.module.scss';

function PrivacyPage({ privacyPolicy }) {
  return (
    <PageLayout title="Our privacy policy">
      <div className={styles.privacy}>
        <SectionTitle second="Privacy policy" />
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: privacyPolicy?.body }} />
      </div>
    </PageLayout>
  );
}

export default PrivacyPage;

export async function getStaticProps() {
  const shopInfo = await getPrivacyPolicy();
  const privacyPolicy = shopInfo?.privacyPolicy;
  return { props: { privacyPolicy } };
}
