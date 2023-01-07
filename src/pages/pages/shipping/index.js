import Page from '@/layout/Page/Page';
import { getShippingPolicy } from '@/lib/shopify/shop/shopApiCall';
import styles from './shipping.module.scss';

function ShippingPage({ shippingPolicy }) {
  return (
    <Page title="Our shipping policies">
      <div className={styles.privacy}>
        <div dangerouslySetInnerHTML={{ __html: shippingPolicy?.body }} />
      </div>
    </Page>
  );
}

export default ShippingPage;

export async function getStaticProps() {
  const shopInfo = await getShippingPolicy();
  const { shippingPolicy } = shopInfo;

  return {
    props: {
      shippingPolicy,
    },
  };
}
