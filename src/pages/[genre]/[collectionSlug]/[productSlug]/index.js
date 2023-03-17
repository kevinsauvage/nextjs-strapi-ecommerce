import { useRouter } from 'next/router';

import PageLoader from '@/components/_loaders/PageLoader/PageLoader';
import PhotoGallery from '@/components/_scopes/product/PhotoGallery/PhotoGallery';
import ProductDescription from '@/components/_scopes/product/ProductDescription/ProductDescription';
import ProductDetails from '@/components/_scopes/product/ProductDetails/ProductDetails';
import ProductsList from '@/components/_scopes/product/ProductList/ProductsList';
import ProductReviews from '@/components/_scopes/product/ProductReview/ProductReviews';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import useProductSelection from '@/hooks/useProductSelection';
import PageLayout from '@/layout/PageLayout/PageLayout';
import getClient from '@/shopify/index';

import styles from './ProductSlug.module.scss';

const ProductPage = ({ product, recommendations = [] }) => {
  const router = useRouter();

  const {
    isOptionSelected,
    handleSetSelectedProductOption,
    selectedVariant,
    handleAddToCart,
    handleChangeInput,
    isOptionOutOfStock,
    totalPrice,
    quantity,
  } = useProductSelection({ product });

  if (router.isFallback) return <PageLoader />;

  const { title, description, descriptionHtml, variants } = product;

  return (
    <PageLayout title={title} description={description}>
      <Breadcrumbs lastElement={title} />
      <Container>
        <div className={styles.top}>
          <PhotoGallery images={variants?.map((item) => item.image)} />
          <ProductDescription
            product={product}
            quantity={quantity}
            isOptionOutOfStock={isOptionOutOfStock}
            handleChangeInput={handleChangeInput}
            handleAddToCart={handleAddToCart}
            handleSetSelectedProductOption={handleSetSelectedProductOption}
            selected={selectedVariant}
            isOptionSelected={isOptionSelected}
            isModal={false}
            totalPrice={totalPrice}
          />
        </div>
      </Container>
      <Container size="medium">
        <ProductDetails html={descriptionHtml} />
        <ProductReviews product={product} />
      </Container>
      {Array.isArray(recommendations) && recommendations.length > 0 && (
        <div className={styles.recommendations}>
          <Container size="medium">
            <h3 className={styles['recommendations-title']}>Recommendations</h3>
            <ProductsList products={recommendations} layout="grid" />
          </Container>
        </div>
      )}
    </PageLayout>
  );
};

export default ProductPage;

export async function getStaticProps({ params }) {
  const product =
    (await getClient().storefront.product.getProductByHandle({
      handle: params.productSlug,
      identifiers: [{ key: 'reviews', namespace: 'custom' }],
    })) || undefined;

  const recommendations =
    (await getClient().storefront.product.productRecommendations({ productId: product?.id })) || undefined;
  return { props: { product, recommendations }, revalidate: 10 };
}

export async function getStaticPaths() {
  const data = await getClient().storefront.product.getProducts({ first: 200, sortKey: 'BEST_SELLING' });

  const paths = data.products.map((product) => ({
    params: {
      collectionSlug: product?.collections?.[0]?.handle,
      genre: product.productType,
      productSlug: product.handle,
    },
  }));

  return { fallback: true, paths };
}
