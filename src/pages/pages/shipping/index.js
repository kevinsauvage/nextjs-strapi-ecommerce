import Page from '@/layout/Page/Page';
import Carousel from '@/components/Carousel/Carousel';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import { getShippingPolicy } from '@/lib/shopify/shop/shopApiCall';
import ProductCardDefault from '@/components/scopes/product/ProductCardDefault/ProductCardDefault';
import styles from './shipping.module.scss';

function ShippingPage({ bestSelling, shippingPolicy }) {
  return (
    <Page
      title="Our shipping policies"
      bannerTitle="Shipping policies"
      bannerDescription="Welcome to our shipping information page! Here you can find answers to frequently asked questions about our shipping policy and process, including how to track your order, available shipping options, and delivery times. If you have any additional questions or need assistance, please don't hesitate to contact us. Thank you for choosing us."
    >
      <div className={styles.privacy}>
        <div dangerouslySetInnerHTML={{ __html: shippingPolicy?.body }} />
        {bestSelling &&
          Array.isArray(bestSelling.products) &&
          bestSelling.products.length > 0 && (
            <Carousel title="Best Selling Products">
              {bestSelling.products.map((product) => (
                <ProductCardDefault product={product} key={product.id} />
              ))}
            </Carousel>
          )}
      </div>
    </Page>
  );
}

export default ShippingPage;

export async function getStaticProps() {
  const bestSelling = await getProducts('BEST_SELLING', 20);
  const shopInfo = await getShippingPolicy();
  const { shippingPolicy } = shopInfo;

  return {
    props: {
      bestSelling,
      shippingPolicy,
    },
  };
}
