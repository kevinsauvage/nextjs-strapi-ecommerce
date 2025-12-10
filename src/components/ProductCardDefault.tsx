'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';

import useUserContext from '@/contexts/UserContext/useUserContext';
import type { ProductFieldsFragment } from '@/shopify/storefront';
import { mapShopifyImagesToImageFields } from '@/utils/images';

import Price from './Price';
import QuickBuy from './QuickBuy';
import SpinnerLoader from './SpinnerLoader';
import { Button } from './ui/button';

const isWhatPercentOf = (x: number, y: number) => (((x - y) / y) * 100).toFixed(0);

type ProductCardDefaultProps = {
  product: ProductFieldsFragment;
  priority: boolean;
};

const ProductCardDefault = memo(function ProductCardDefault({
  product,
  priority,
}: ProductCardDefaultProps) {
  const { title, images, handle, variants, id, priceRange } = product;
  const { price, compareAtPrice } = variants?.edges?.[0]?.node || {};
  const { userWishlist, handleSetWishlist } = useUserContext();
  const [loading, setLoading] = useState(false);

  const productImages = mapShopifyImagesToImageFields(images?.edges);

  const isWishlisted = userWishlist?.find((item) => item.id === id);

  const handleWishlist = async () => {
    setLoading(true);
    await handleSetWishlist(!!isWishlisted, product);
    setLoading(false);
  };

  return (
    <li className="relative group overflow-hidden rounded-sm transition-all">
      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80">
          <SpinnerLoader />
        </div>
      )}
      <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
        <Button
          variant="ghost"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-100 ${
            isWishlisted ? 'text-red-500' : ''
          }`}
          type="button"
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.stopPropagation();
            event.preventDefault();
            handleWishlist().catch(() => {
              setLoading(false);
            });
          }}
        >
          <Heart color="currentColor" className={isWishlisted ? 'fill-red-500' : ''} />
        </Button>

        <QuickBuy product={product} />
      </div>

      <Link
        className="block cursor-pointer"
        href={`/collections/products/${handle}`}
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
});

export default ProductCardDefault;
