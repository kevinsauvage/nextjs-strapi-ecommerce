import Head from 'next/head';
import { useRouter } from 'next/router';
import { messages } from '../../config/i18n';

function AboutPage() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <div className="">
      <Head>
        <title>About</title>
      </Head>

      <div className="">
        <h1>About page</h1>
      </div>
    </div>
  );
}

export default AboutPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
