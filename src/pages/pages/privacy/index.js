import Page from '@/layout/Page/Page';
import { getPrivacyPolicy } from '@/lib/shopify/shop/shopApiCall';
import styles from './Privacy.module.scss';

function PrivacyPage({ privacyPolicy }) {
  return (
    <Page title="Our privacy policy">
      <div className={styles.privacy}>
        <div dangerouslySetInnerHTML={{ __html: privacyPolicy?.body }} />
      </div>
    </Page>
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
