import { getShippingPolicy } from '@/lib/shopify/shop/shopApiCall';
import PageLayout from '@/layout/PageLayout/PageLayout';
import styles from './shipping.module.scss';

function ShippingPage({ shippingPolicy }) {
  return (
    <PageLayout title="Our shipping policies">
      <div className={styles.privacy}>
        <div dangerouslySetInnerHTML={{ __html: shippingPolicy?.body }} />
      </div>
    </PageLayout>
  );
}

export default ShippingPage;

export async function getStaticProps() {
  const shopInfo = await getShippingPolicy();
  const { shippingPolicy } = shopInfo;
  return { props: { shippingPolicy } };
}
