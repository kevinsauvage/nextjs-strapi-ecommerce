import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';
import styles from './refund.module.scss';

function RefoundPage({ refundPolicy }) {
  return (
    <PageLayout title="Our refund policy">
      <div className={styles.privacy}>
        <h1>Refound policy</h1>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: refundPolicy?.body }} />
      </div>
    </PageLayout>
  );
}

export default RefoundPage;

export async function getStaticProps() {
  const shopInfo = await getClient().shop.getRefundPolicy();
  const refundPolicy = shopInfo?.refundPolicy;
  return { props: { refundPolicy } };
}
