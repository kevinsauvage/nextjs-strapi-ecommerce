import Head from 'next/head';
import { useRouter } from 'next/router';
import { messages } from '../../config/i18n';

function CartPage() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <div className="">
      <Head>
        <title>Cart</title>
      </Head>

      <div className="">
        <h1>Cart page</h1>
      </div>
    </div>
  );
}

export default CartPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
