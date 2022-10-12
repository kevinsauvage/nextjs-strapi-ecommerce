import Page from '@/layout/Page/Page';
import Carousel from '@/components/Carousel/Carousel';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import { getShop } from '@/lib/shopify/shop/shopApiCall';
import ProductCardDefault from '@/components/product/ProductCardDefault/ProductCardDefault';
import styles from './Terms.module.scss';

function TermsPage({ bestSelling, shopInfo }) {
  const { termsOfService } = shopInfo || {};

  return (
    <Page title="Our terms and conditions">
      <div className={styles.terms}>
        <div dangerouslySetInnerHTML={{ __html: termsOfService.body }} />
        {bestSelling &&
          Array.isArray(bestSelling.products) &&
          bestSelling.products.length > 0 && (
            <Carousel title="Best Selling Products">
              {bestSelling.products.map((product) => (
                <ProductCardDefault key={product.id} product={product} />
              ))}
            </Carousel>
          )}
      </div>
    </Page>
  );
}

export default TermsPage;

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
