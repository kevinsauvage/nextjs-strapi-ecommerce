import Head from 'next/head';
import { useRouter } from 'next/router';
import { messages } from '../../config/i18n';

function SearchPage() {
  const router = useRouter();

  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <div className="">
      <Head>
        <title>Search</title>
      </Head>

      <div className="">
        <h1>Search page</h1>
      </div>
    </div>
  );
}

export default SearchPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
