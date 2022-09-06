import nookies from 'nookies';
import CategoryButtons from '@/components/CategoryButtons/CategoryButtons';
import SecureBanner from '@/components/SecureBanner/SecureBanner';
import Banner1 from '@/components/BannerHome/Banner1';
import Banner2 from '@/components/BannerHome/Banner2';
import Banner3 from '@/components/BannerHome/Banner3';
import { messages } from '@/config/i18n';
import styles from '@/styles/Home.module.scss';

export default function Home({ collections, policies, shopInfos }) {
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

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  console.log(cookies);
  console.log(cookies.shopify_token, 'token ');

  return {
    props: {
      messages: messages[ctx.locale],
      cookies,
    },
  };
}
