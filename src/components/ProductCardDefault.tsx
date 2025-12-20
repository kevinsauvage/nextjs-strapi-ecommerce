'use client';

import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import config from '@/config';
import useCartContext from '@/contexts/CartContext/useCartContext';
import type { ProductFieldsFragment } from '@/shopify/storefront';
import { mapShopifyImagesToImageFields } from '@/utils/images';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import Price from './Price';
import ProductCardActions from './ProductCardActions';
import SpinnerLoader from './SpinnerLoader';

const isWhatPercentOf = (x: number, y: number) => (((x - y) / y) * 100).toFixed(0);

type ProductCardDefaultProps = {
  product: ProductFieldsFragment;
  priority: boolean;
};

const ProductCardDefault = ({ product, priority }: ProductCardDefaultProps) => {
  const { title, images, handle, variants, id, priceRange } = product;
  const { price, compareAtPrice, availableForSale, quantityAvailable } =
    variants?.edges?.[0]?.node || {};
  const [imageLoading, setImageLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { handleAddToCart } = useCartContext();

  const productImages = mapShopifyImagesToImageFields(images?.edges);
  const variantId = variants?.edges?.[0]?.node?.id;

  const handleQuickAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId || !availableForSale) return;

    setAddingToCart(true);
    try {
      await handleAddToCart(String(variantId), 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const isLowStock = quantityAvailable && quantityAvailable < 5 && availableForSale;
  const isSoldOut = !availableForSale;

  return (
    <li className="relative group overflow-hidden rounded-sm transition-all hover:shadow-lg">
      <ProductCardActions product={product} productId={id} />

      <Link
        className="block cursor-pointer"
        href={`${config.routes.collection}/products/${handle}`}
        aria-label={`View product details for ${title}`}
        scroll
      >
        <div className="relative overflow-hidden aspect-square">
          {imageLoading && <Skeleton className="absolute inset-0" />}
          <Image
            src={productImages?.[0]?.large || ''}
            alt={productImages?.[0]?.altText || title}
            width={800}
            height={800}
            placeholder="blur"
            blurDataURL={productImages?.[0]?.blurDataURL || ''}
            priority={priority}
            aria-label={`Image of ${title}`}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />

          {/* Discount Badge */}
          {compareAtPrice && price?.amount !== compareAtPrice?.amount && (
            <Badge
              variant="destructive"
              className="absolute left-2 top-2 z-10 text-caption-sm font-semibold"
            >
              -{isWhatPercentOf(Number(price?.amount), Number(compareAtPrice?.amount))}%
            </Badge>
          )}

          {/* Availability Indicators */}
          {isSoldOut && (
            <Badge
              variant="destructive"
              className="absolute right-2 top-2 z-10 text-caption-sm font-medium"
            >
              Sold Out
            </Badge>
          )}
          {isLowStock && !isSoldOut && (
            <Badge
              variant="secondary"
              className="absolute right-2 top-2 z-10 text-caption-sm font-medium"
            >
              Low Stock
            </Badge>
          )}

          {/* Quick Add to Cart Button - Shows on Hover */}
          {availableForSale && variantId && (
            <div className="absolute inset-x-0 bottom-0 z-10 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:block hidden">
              <Button
                size="sm"
                className="w-full gap-2 shadow-lg"
                onClick={handleQuickAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <>
                    <SpinnerLoader size="sm" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Mobile Add to Cart Button - Always Visible */}
          {availableForSale && variantId && (
            <div className="absolute inset-x-0 bottom-0 z-10 p-2 md:hidden">
              <Button
                size="sm"
                className="w-full gap-2 shadow-lg"
                onClick={handleQuickAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <>
                    <SpinnerLoader size="sm" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="py-4">
          <h3 className="text-heading-4 mb-2 line-clamp-2">{title}</h3>
          <div>
            <Price compareAtPrice={compareAtPrice} priceRange={priceRange} price={price} />
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ProductCardDefault;
