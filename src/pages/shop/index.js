import Head from 'next/head';
import { useRouter } from 'next/router';
import { messages } from '../../config/i18n';
import apiCall from '../../utils/apiStrapi';

function Shop({ products }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <div className="">
      <Head>
        <title>Shop</title>
      </Head>

      <div className="">
        <h1>Shop page</h1>
      </div>
    </div>
  );
}

export default Shop;

export async function getStaticProps({ locale }) {
  const products = await apiCall.product.getProducts();
  return { props: { products, messages: messages[locale] } };
}
