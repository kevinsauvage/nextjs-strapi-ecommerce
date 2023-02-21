import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';
import styles from './Privacy.module.scss';

function PrivacyPage({ privacyPolicy }) {
  return (
    <PageLayout title="Our privacy policy">
      <div className={styles.privacy}>
        <h1>Privacy policy</h1>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: privacyPolicy?.body }} />
      </div>
    </PageLayout>
  );
}

export default PrivacyPage;

export async function getStaticProps() {
  const shopInfo = await getClient().storefront.shop.getPrivacyPolicy();
  const privacyPolicy = shopInfo?.privacyPolicy;
  return { props: { privacyPolicy } };
}
