import Head from 'next/head';
import { useRouter } from 'next/router';
import { messages } from '../../config/i18n';
import apiCall from '../../utils/apiStrapi';

function CategoryPage({ categories }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading category...</div>;

  return (
    <div>
      <Head>
        <title>categories</title>
      </Head>
      <h1>Categories PAGE</h1>
    </div>
  );
}

export default CategoryPage;

export async function getStaticProps({ locale }) {
  const categories = await apiCall.category.getCategories();
  return { props: { categories, messages: messages[locale] } };
}
