'use client';

import { useState } from 'react';
import { Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import useUserContext from '@/contexts/UserContext/useUserContext';
import type { ProductFieldsFragment } from '@/shopify/storefront';

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import Price from './Price';
import ProductDescription from './ProductDescription';
import SpinnerLoader from './SpinnerLoader';

const isWhatPercentOf = (x: number, y: number) => (((x - y) / y) * 100).toFixed(0);

const ProductCardDefault = ({
  product,
  priority,
}: {
  product: ProductFieldsFragment;
  priority: boolean;
}) => {
  const { title, images, handle, variants, id, priceRange } = product;
  const { price, compareAtPrice } = variants?.edges?.[0]?.node || {};
  const { userWishlist, handleSetWishlist } = useUserContext();
  const [loading, setLoading] = useState(false);

  const productImages =
    (images?.edges?.map((image) => image.node) as unknown as ImageFields[]) || [];

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
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            handleWishlist().catch(() => {
              setLoading(false);
            });
          }}
        >
          <Heart color="currentColor" className={isWishlisted ? 'fill-red-500' : ''} />
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-100"
              type="button"
              aria-label="Quick view"
            >
              <Eye />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] w-full max-h-[90vh] overflow-auto ">
            <DialogTitle className="sr-only">Quick view for {title}</DialogTitle>
            <div className="pr-3">
              <ProductDescription product={product} isModal />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Link
        className="block cursor-pointer"
        href={`/collections/products/${handle}`}
        aria-label={`View product details for ${title}`}
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
