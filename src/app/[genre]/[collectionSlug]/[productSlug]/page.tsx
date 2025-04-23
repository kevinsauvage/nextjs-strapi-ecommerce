import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import Container from '@/components/Container/Container';
import Flexbox from '@/components/Flexbox/Flexbox';
import ProductDescription from '@/components/ProductDescription/ProductDescription';
import ProductDetails from '@/components/ProductDetails/ProductDetails';
import ProductRecommendations from '@/components/ProductRecommendations/ProductRecommendations';
import { storefrontSdk } from '@/shopify/index';

type PageProperties = {
  params: Promise<{
    genre: string;
    collectionSlug: string;
    productSlug: string;
  }>;
};

const ProductPage = async ({ params }: PageProperties) => {
  const parameters = await params;

  const productResponse = await storefrontSdk().getProductByHandle({
    handle: parameters.productSlug,
    identifiers: [],
  });

  const { product } = productResponse;

  if (!product) {
    notFound();
  }

  const recommendations = await storefrontSdk().productRecommendations({
    identifiers: [],
    productId: product.id,
  });

  const title = product?.title;

  return (
    <div>
      <Breadcrumbs lastElement={title} />
      <Container>
        <Flexbox gap={20}>
          <ProductDescription product={product} isModal={false} />
        </Flexbox>
      </Container>
      <Container size="medium">
        <ProductDetails html={product?.descriptionHtml as string} />
      </Container>
      <ProductRecommendations recommendations={recommendations} />
    </div>
  );
};

export default ProductPage;
