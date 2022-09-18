import SecureBanner from '@/components/SecureBanner/SecureBanner';
import Banner1 from '@/components/BannerHome/Banner1';
import Banner2 from '@/components/BannerHome/Banner2';
import styles from '@/styles/Home.module.scss';
import Container from '@/components/Container/Container';
// import { getLastOrderedProducts } from '@/lib/algolia';

export default function Home({ lastOrderedProduct }) {
  console.log(lastOrderedProduct, 'Algolia lastOrderedProduct');
  return (
    <div className={styles.container}>
      <Container>
        <Banner1 />
        <Banner2 />
      </Container>
      <SecureBanner />
    </div>
  );
}

export async function getServerSideProps() {
  // const lastOrderedProduct = await getLastOrderedProducts();

  return {
    props: {
      // lastOrderedProduct,
    },
  };
}
