import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import NextImage from '../../components/Image/Image';
import apiCall from '../../utils/apiStrapi';
import { messages } from '../../config/i18n';

function ProductPage({ product: { attributes } }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;
  const t = useTranslations('page.productDescription');

  return (
    <div className="">
      <Head>
        <title>{attributes.title} product</title>
      </Head>
      <div className="">
        <h1>Product description page</h1>
        <div className="">
          <NextImage
            media={attributes.img_url?.data?.attributes?.formats?.medium}
          />
        </div>
        <div>
          <h4 className="">
            {attributes.title} - ${attributes.price}
          </h4>
          <div className="">{attributes.description}</div>
        </div>
        {attributes.published ? (
          <button type="button">Add to cart</button>
        ) : (
          <div className="">
            <div className="" role="alert">
              <span className="">Coming soon...</span>
              <span className="">This article is not available yet.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;

export async function getStaticProps({ params, locale }) {
  const product = await apiCall.product.getProduct(params.slug);
  return { props: { product }, messages: messages[locale] };
}

export async function getStaticPaths() {
  const products = await apiCall.product.getProducts();
  return {
    paths: products.map((_product) => ({
      params: { slug: String(_product.id) },
    })),
    fallback: true,
  };
}
