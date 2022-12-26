import Page from '@/layout/Page/Page';
import Carousel from '@/components/Carousel/Carousel';
import { getProducts } from '@/lib/shopify/product/productApiCall';
import ProductCardDefault from '@/components/scopes/product/ProductCardDefault/ProductCardDefault';
import { getPrivacyPolicy } from '@/lib/shopify/shop/shopApiCall';
import styles from './Privacy.module.scss';

function PrivacyPage({ bestSelling, privacyPolicy }) {
  return (
    <Page
      title="Our privacy policy"
      bannerTitle="Privacy"
      bannerDescription="Welcome to our privacy page! At our company, we are committed to protecting your personal information and ensuring that your privacy is respected. We have implemented various measures to secure your information and prevent unauthorized access, use, or disclosure. We also adhere to all applicable laws and regulations regarding privacy and data protection. If you have any questions or concerns about your privacy, please don't hesitate to contact us. Thank you for choosing us and trusting us with your personal information."
    >
      <div className={styles.privacy}>
        <div dangerouslySetInnerHTML={{ __html: privacyPolicy?.body }} />
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

export default PrivacyPage;

export async function getStaticProps() {
  const bestSelling = await getProducts('BEST_SELLING', 20);
  const shopInfo = await getPrivacyPolicy();
  const privacyPolicy = shopInfo?.privacyPolicy;

  return {
    props: {
      bestSelling,
      privacyPolicy,
    },
  };
}
