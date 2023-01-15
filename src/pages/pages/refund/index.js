import { getRefundPolicy } from '@/lib/shopify/shop/shopApiCall';
import PageLayout from '@/layout/PageLayout/PageLayout';
import styles from './refund.module.scss';

function RefoundPage({ refundPolicy }) {
  return (
    <PageLayout title="Our refund policy">
      <div className={styles.privacy}>
        <div dangerouslySetInnerHTML={{ __html: refundPolicy?.body }} />
      </div>
    </PageLayout>
  );
}

export default RefoundPage;

export async function getStaticProps() {
  const shopInfo = await getRefundPolicy();
  const refundPolicy = shopInfo?.refundPolicy;
  return { props: { refundPolicy } };
}
