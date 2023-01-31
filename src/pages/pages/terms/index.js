import { getTermsOfService } from '@/lib/shopify/shop/shopApiCall';
import PageLayout from '@/layout/PageLayout/PageLayout';
import styles from './Terms.module.scss';

function TermsPage({ termsOfService }) {
  return (
    <PageLayout title="Our terms and conditions">
      <div className={styles.terms}>
        <h1>Terms and Conditions</h1>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: termsOfService?.body }} />
      </div>
    </PageLayout>
  );
}

export default TermsPage;

export async function getStaticProps() {
  const shopInfo = await getTermsOfService();
  const { termsOfService } = shopInfo;
  return { props: { termsOfService } };
}
