import SecureBanner from '@/components/SecureBanner/SecureBanner';
import Banner1 from '@/components/BannerHome/Banner1';
import styles from '@/styles/Home.module.scss';
import Container from '@/components/Container/Container';
import { getProducts } from '@/lib/shopify/products';
import Carousel from '@/components/Carousel/Carousel';
import ProductCardDefault from '@/components/ProductCardDefault/ProductCardDefault';

export default function Home({ bestSelling }) {
  return (
    <div className={styles.container}>
      <Banner1 />
      <Container>
        {bestSelling &&
          Array.isArray(bestSelling.products) &&
          bestSelling.products.length > 0 && (
            <Carousel title="Best Selling Products">
              {bestSelling.products.map((product) => (
                <ProductCardDefault key={product.id} product={product} />
              ))}
            </Carousel>
          )}
      </Container>
      <SecureBanner />
    </div>
  );
}

export async function getStaticProps() {
  const bestSelling = await getProducts('BEST_SELLING', 20);
  return {
    props: {
      bestSelling,
    },
    revalidate: 10,
  };
}
