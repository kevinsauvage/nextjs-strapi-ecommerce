import SecureBanner from '@/components/SecureBanner/SecureBanner';
import Banner1 from '@/components/BannerHome/Banner1';
import Banner2 from '@/components/BannerHome/Banner2';
import Banner3 from '@/components/BannerHome/Banner3';
import styles from '@/styles/Home.module.scss';
import Container from 'src/components/Container/Container';

export default function Home() {
  return (
    <div className={styles.container}>
      <Container>
        <Banner1 />
        <Banner2 />
        <Banner3 />
      </Container>
      <SecureBanner />
    </div>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      messages: (await import(`../locales/${locale}.json`)).default,
    },
  };
}
