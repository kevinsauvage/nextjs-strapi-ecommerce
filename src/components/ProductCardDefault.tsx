import Image from 'next/image';
import Link from 'next/link';

import config from '@/config';
import type { ProductFieldsFragment } from '@/shopify/storefront';
import { mapShopifyImagesToImageFields } from '@/utils/images';

import Price from './Price';
import ProductCardActions from './ProductCardActions';

const isWhatPercentOf = (x: number, y: number) => (((x - y) / y) * 100).toFixed(0);

type ProductCardDefaultProps = {
  product: ProductFieldsFragment;
  priority: boolean;
};

const ProductCardDefault = ({ product, priority }: ProductCardDefaultProps) => {
  const { title, images, handle, variants, id, priceRange } = product;
  const { price, compareAtPrice } = variants?.edges?.[0]?.node || {};

  const productImages = mapShopifyImagesToImageFields(images?.edges);

  return (
    <li className="relative group overflow-hidden rounded-sm transition-all">
      <ProductCardActions product={product} productId={id} />

      <Link
        className="block cursor-pointer"
        href={`${config.routes.collection}/products/${handle}`}
        aria-label={`View product details for ${title}`}
        scroll
      >
        <div className="relative overflow-hidden">
          <Image
            src={productImages?.[0]?.large || ''}
            alt={productImages?.[0]?.altText || title}
            width={800}
            height={800}
            placeholder="blur"
            blurDataURL={productImages?.[0]?.blurDataURL || ''}
            priority={priority}
            aria-label={`Image of ${title}`}
            className="aspect-square object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        {compareAtPrice && price?.amount !== compareAtPrice?.amount && (
          <div className="absolute left-2 top-2 z-10 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            {isWhatPercentOf(Number(price?.amount), Number(compareAtPrice?.amount))}%
          </div>
        )}

        <div className="py-4">
          <div className="mb-2 text-sm font-medium">{title}</div>
          <div>
            <Price compareAtPrice={compareAtPrice} priceRange={priceRange} price={price} />
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ProductCardDefault;
