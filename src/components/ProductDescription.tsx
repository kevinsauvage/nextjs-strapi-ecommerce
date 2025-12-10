import type { GetProductByHandleQuery } from '@/shopify/storefront';
import { mapShopifyImagesToImageFields } from '@/utils/images';

import PhotoGallery from './PhotoGallery';
import ProductDescriptionClient from './ProductDescriptionClient';
import { Badge } from './ui/badge';

const ProductDescription = ({
  product,
  isModal,
}: {
  product: GetProductByHandleQuery['product'];
  isModal?: boolean;
}) => {
  if (!product) return null;

  const images = product.images;
  const descriptionHtml: string =
    typeof product.descriptionHtml === 'string' ? product.descriptionHtml : '';

  // Get default variant data for initial render (server-side)
  const defaultVariant = product.variants?.edges?.[0]?.node
    ? {
        quantityAvailable: product.variants.edges[0].node.quantityAvailable,
        availableForSale: product.variants.edges[0].node.availableForSale,
        price: product.variants.edges[0].node.price,
        sku: product.variants.edges[0].node.sku,
        title: product.variants.edges[0].node.title,
        weight: product.variants.edges[0].node.weight,
        weightUnit: product.variants.edges[0].node.weightUnit,
      }
    : {
        quantityAvailable: null,
        availableForSale: false,
        price: undefined,
        sku: null,
        title: undefined,
        weight: null,
        weightUnit: undefined,
      };

  const productImages = mapShopifyImagesToImageFields(images?.edges);

  const {
    quantityAvailable,
    availableForSale,
  } = defaultVariant;

  return (
    <div className="grid md:grid-cols-7 relative gap-12">
      <div className="relative md:col-span-4">
        <PhotoGallery images={productImages} />

        {!availableForSale && (
          <Badge
            variant="destructive"
            className="absolute right-4 top-4 px-3 py-1.5 text-sm font-medium"
          >
            Sold Out
          </Badge>
        )}

        {quantityAvailable && quantityAvailable < 5 && availableForSale && (
          <Badge
            variant="secondary"
            className="absolute right-4 top-4 px-3 py-1.5 text-sm font-medium"
          >
            Low Stock: {quantityAvailable} left
          </Badge>
        )}
      </div>

      <ProductDescriptionClient
        product={product}
        isModal={isModal}
        defaultVariant={defaultVariant}
        descriptionHtml={descriptionHtml}
        productId={product.id}
      />
    </div>
  );
};

export default ProductDescription;
