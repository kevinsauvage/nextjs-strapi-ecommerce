import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';
import styles from './shipping.module.scss';

function ShippingPage({ shippingPolicy }) {
  return (
    <PageLayout title="Our shipping policies">
      <div className={styles.privacy}>
        <h1>Shipping policy</h1>

        <div className={styles.content} dangerouslySetInnerHTML={{ __html: shippingPolicy?.body }} />
      </div>
    </PageLayout>
  );
}

export default ShippingPage;

export async function getStaticProps() {
  const shopInfo = await getClient().storefront.shop.getShippingPolicy();
  const { shippingPolicy } = shopInfo;
  return { props: { shippingPolicy } };
}
