import CategoryButtons from '@/components/CategoryButtons/CategoryButtons';
import SecureBanner from '@/components/SecureBanner/SecureBanner';
import Banner1 from '@/components/BannerHome/Banner1';
import Banner2 from '@/components/BannerHome/Banner2';
import Banner3 from '@/components/BannerHome/Banner3';
import styles from '@/styles/Home.module.scss';

export default function Home({ collections }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Banner1 />
        <CategoryButtons collections={collections} />
        <Banner2 />
        <Banner3 />
      </main>
      <SecureBanner />
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../locales/${locale}.json`)).default,
    },
  };
}
