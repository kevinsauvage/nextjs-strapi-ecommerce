import Page from '@/layout/Page/Page';
import Carousel from '@/components/Carousel/Carousel';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import ProductCardDefault from '@/components/scopes/product/ProductCardDefault/ProductCardDefault';
import { getTermsOfService } from '@/lib/shopify/shop/shopApiCall';
import styles from './Terms.module.scss';

function TermsPage({ bestSelling, termsOfService }) {
  return (
    <Page title="Our terms and conditions">
      <div className={styles.terms}>
        <div dangerouslySetInnerHTML={{ __html: termsOfService?.body }} />
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

export default TermsPage;

export async function getStaticProps() {
  const bestSelling = await getProducts('BEST_SELLING', 20);
  const shopInfo = await getTermsOfService();
  const { termsOfService } = shopInfo;

  return {
    props: {
      bestSelling,
      termsOfService,
    },
  };
}
