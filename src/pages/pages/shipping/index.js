import { getShippingPolicy } from '@/lib/shopify/shop/shopApiCall';
import PageLayout from '@/layout/PageLayout/PageLayout';
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import styles from './shipping.module.scss';

function ShippingPage({ shippingPolicy }) {
  return (
    <PageLayout title="Our shipping policies">
      <div className={styles.privacy}>
        <SectionTitle second="Shipping policy" />
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: shippingPolicy?.body }} />
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
