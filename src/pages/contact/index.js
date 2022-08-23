import Head from 'next/head';
import { useRouter } from 'next/router';
import { messages } from '../../config/i18n';

function ContactPage() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <div className="">
      <Head>
        <title>Contact</title>
      </Head>

      <div className="">
        <h1>Contact page</h1>
      </div>
    </div>
  );
}

export default ContactPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
