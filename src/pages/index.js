import styles from '../styles/Home.module.scss';
import { messages } from '../config/i18n';
import SecureBanner from '../components/SecureBanner/SecureBanner';
import Banner1 from '../components/BannerHome/Banner1';
import Banner2 from '../components/BannerHome/Banner2';
import Banner3 from '../components/BannerHome/Banner3';
import CategoryButtons from '../components/CategoryButtons/CategoryButtons';

export default function Home({ collections, policies, shopInfos }) {
  console.log(shopInfos);

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

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
