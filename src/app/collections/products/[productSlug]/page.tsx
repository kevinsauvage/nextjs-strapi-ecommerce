import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';
import ProductDescription from '@/components/ProductDescription';
import ProductRecommendations from '@/components/ProductRecommendations';
import { storefrontSdk } from '@/shopify/index';

type parametersType = {
  genre: string;
  collectionSlug: string;
  productSlug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<parametersType>;
}): Promise<Metadata> {
  const { productSlug } = await params;

  const productResponse = await storefrontSdk().getProductSeoByHandle({
    handle: productSlug,
  });

  const { product } = productResponse;

  return {
    description: product.seo?.description || product?.description,
    title: product.seo?.title || product?.title,
  };
}

type PageProperties = {
  params: Promise<parametersType>;
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
    <div className="container mx-auto px-4">
      <Breadcrumbs lastElement={title} />
      <ProductDescription product={product} isModal={false} />

      <div className="my-12">
        <h3 className="text-2xl font-bold mb-4">Recommended Products</h3>
        <ProductRecommendations recommendations={recommendations} />
      </div>
    </div>
  );
};

export default ProductPage;
