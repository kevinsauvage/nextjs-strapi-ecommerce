import Page from '@/layout/Page/Page';
import { getRefundPolicy } from '@/lib/shopify/shop/shopApiCall';
import styles from './refund.module.scss';

function RefoundPage({ refundPolicy }) {
  return (
    <Page title="Our refund policy">
      <div className={styles.privacy}>
        <div dangerouslySetInnerHTML={{ __html: refundPolicy?.body }} />
      </div>
    </Page>
  );
}

export default RefoundPage;

export async function getStaticProps() {
  const shopInfo = await getRefundPolicy();
  const refundPolicy = shopInfo?.refundPolicy;
  return {
    props: {
      refundPolicy,
    },
  };
}
