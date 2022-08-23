import Head from 'next/head';
import { useRouter } from 'next/router';
import { messages } from '../../config/i18n';

function TermsPage() {
  const router = useRouter();

  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <div className="">
      <Head>
        <title>TermsPage</title>
      </Head>

      <div className="">
        <h1>TermsPage page</h1>
      </div>
    </div>
  );
}

export default TermsPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
