import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductsList from '../../components/ProductList/ProductsList';
import { messages } from '../../config/i18n';
import apiCall from '../../utils/apiStrapi';

function CategoryPage({ category }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading category...</div>;

  return (
    <div>
      <Head>
        <title>{category.name} products</title>
      </Head>
      <h1>Category PAGE</h1>
      <p>{category.name}</p>
      <ProductsList products={category.products.data} />
    </div>
  );
}

export default CategoryPage;

export async function getStaticProps({ params, locale }) {
  const category = await apiCall.category.getCategory(params.slug);
  return {
    props: { category: category.attributes, messages: messages[locale] },
  };
}

export async function getStaticPaths() {
  const categories = await apiCall.category.getCategories();
  return {
    paths: categories.map((_category) => ({
      params: { slug: String(_category.id) },
    })),
    fallback: true,
  };
}
