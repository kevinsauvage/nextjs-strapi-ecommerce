import Page from '@/layout/Page/Page';
import Carousel from '@/components/Carousel/Carousel';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import { getShop } from '@/lib/shopify/shop/shopApiCall';
import ProductCardDefault from '@/components/product/ProductCardDefault/ProductCardDefault';
import styles from './refound.module.scss';

function RefoundPage({ bestSelling, shopInfo }) {
  const { refundPolicy } = shopInfo || {};

  return (
    <Page title="Our privacy policy">
      <div className={styles.privacy}>
        <div dangerouslySetInnerHTML={{ __html: refundPolicy?.body }} />
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

export default RefoundPage;

export async function getStaticProps() {
  const bestSelling = await getProducts('BEST_SELLING', 20);
  const shopInfo = await getShop();

  return {
    props: {
      bestSelling,
      shopInfo,
    },
    revalidate: 60,
  };
}
