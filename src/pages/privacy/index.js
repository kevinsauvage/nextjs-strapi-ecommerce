import Head from 'next/head';
import { useRouter } from 'next/router';
import { messages } from '../../config/i18n';

function PrivacyPage() {
  const router = useRouter();

  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <div className="">
      <Head>
        <title>PrivacyPage</title>
      </Head>

      <div className="">
        <h1>PrivacyPage</h1>
      </div>
    </div>
  );
}

export default PrivacyPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
