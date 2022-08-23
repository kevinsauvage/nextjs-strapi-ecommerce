import styles from '../styles/Home.module.scss';
import { messages } from '../config/i18n';
import SecureBanner from '../components/SecureBanner/SecureBanner';
import BannerHome from '../components/BannerHome/BannerHome';
import Container from '../components/Container/Container';

export default function Home() {
  // const tHome = useTranslations('page.home');

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Container>
          <BannerHome />
        </Container>
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
