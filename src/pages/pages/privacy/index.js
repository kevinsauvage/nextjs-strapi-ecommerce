import { getPrivacyPolicy } from '@/lib/shopify/shop/shopApiCall';
import PageLayout from '@/layout/PageLayout/PageLayout';
import styles from './Privacy.module.scss';

function PrivacyPage({ privacyPolicy }) {
  return (
    <PageLayout title="Our privacy policy">
      <div className={styles.privacy}>
        <div dangerouslySetInnerHTML={{ __html: privacyPolicy?.body }} />
      </div>
    </PageLayout>
  );
}

export default PrivacyPage;

export async function getStaticProps() {
  const shopInfo = await getPrivacyPolicy();
  const privacyPolicy = shopInfo?.privacyPolicy;

  return {
    props: {
      privacyPolicy,
    },
  };
}
