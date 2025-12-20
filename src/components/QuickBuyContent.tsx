'use client';

import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import config from '@/config';
import useUserContext from '@/contexts/UserContext/useUserContext';
import useProductSelection from '@/hooks/useProductSelection';
import { cn } from '@/lib/utils';
import type { ProductFieldsFragment } from '@/shopify/storefront';
import { formatPrice } from '@/utils/format';
import { mapShopifyImagesToImageFields } from '@/utils/images';

import Options from './Options';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { SheetFooter } from './ui/sheet';

type QuickBuyContentProps = {
  product: ProductFieldsFragment;
  onClose?: () => void;
};

const QuickBuyContent = ({ product, onClose }: QuickBuyContentProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const {
    handleAddToCart,
    selectedVariant,
    totalPrice,
    handleSetSelectedProductOption,
    quantity,
    handleChangeInput,
    isOptionSelected,
    isOptionOutOfStock,
  } = useProductSelection({ product });

  const { userWishlist, handleSetWishlist } = useUserContext();

  const productImages = mapShopifyImagesToImageFields(product.images?.edges);
  const isWishlisted = userWishlist?.find((item) => item.id === product.id);

  const selectedVariantData = selectedVariant as
    | {
        quantityAvailable?: number | null;
        availableForSale?: boolean;
        price?: { amount: string; currencyCode: string };
        compareAtPrice?: { amount: string; currencyCode: string } | null;
      }
    | undefined;

  const { quantityAvailable, availableForSale, price, compareAtPrice } = selectedVariantData || {};

  const handleWishlist = useCallback(async () => {
    await handleSetWishlist(!!isWishlisted, product);
  }, [handleSetWishlist, isWishlisted, product]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  }, [productImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  }, [productImages.length]);

  const handleAddToCartAndClose = useCallback(() => {
    handleAddToCart();
    onClose?.();
  }, [handleAddToCart, onClose]);

  // Scroll thumbnail strip to show current image
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[currentImageIndex] as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      }
    }
  }, [currentImageIndex]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Image Carousel */}
        <div className="relative bg-muted/30">
          <div className="aspect-square relative overflow-hidden">
            {productImages.length > 0 && (
              <Image
                src={
                  productImages[currentImageIndex]?.large ||
                  productImages[currentImageIndex]?.src ||
                  ''
                }
                alt={productImages[currentImageIndex]?.altText || product.title}
                fill
                className="object-contain transition-opacity duration-300"
                sizes="(max-width: 640px) 100vw, 500px"
                priority
              />
            )}

            {/* Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {!availableForSale && (
                <Badge variant="destructive" className="px-2.5 py-1">
                  Sold Out
                </Badge>
              )}
              {quantityAvailable && quantityAvailable < 5 && availableForSale && (
                <Badge variant="secondary" className="px-2.5 py-1">
                  Only {quantityAvailable} left
                </Badge>
              )}
              {compareAtPrice && price && Number(price.amount) < Number(compareAtPrice.amount) && (
                <Badge className="px-2.5 py-1 bg-red-500 text-white">
                  {Math.round((1 - Number(price.amount) / Number(compareAtPrice.amount)) * 100)}%
                  OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Dot Indicators */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-200',
                    index === currentImageIndex
                      ? 'bg-primary w-6'
                      : 'bg-primary/30 hover:bg-primary/50',
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {productImages.length > 1 && (
          <div ref={thumbnailsRef} className="flex gap-2 p-4 overflow-x-auto scroll-smooth">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  'relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all',
                  index === currentImageIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-muted-foreground/30',
                )}
              >
                <Image
                  src={image.small || image.src || ''}
                  alt={image.altText || `Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}

        <Separator />

        {/* Product Info */}
        <div className="p-4 space-y-4">
          {/* Title & Price */}
          <div>
            {product.productType && (
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {product.productType}
              </span>
            )}
            <h2 className="text-xl font-bold mt-1">{product.title}</h2>
            <div className="flex items-baseline gap-2 mt-2">
              {price && (
                <span className="text-2xl font-bold">
                  {formatPrice(price.amount, price.currencyCode)}
                </span>
              )}
              {compareAtPrice && price && Number(price.amount) < Number(compareAtPrice.amount) && (
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                </span>
              )}
            </div>
            {quantity > 1 && price && (
              <p className="text-sm text-muted-foreground mt-1">
                Total: {formatPrice(totalPrice, price.currencyCode)}
              </p>
            )}
          </div>

          <Separator />

          {/* Options */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-3">
              <Options
                options={product.options}
                onClick={handleSetSelectedProductOption}
                isOptionSelected={isOptionSelected}
                isOptionOutOfStock={isOptionOutOfStock}
              />
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => handleChangeInput(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() => handleChangeInput(quantity + 1)}
                  disabled={quantityAvailable ? quantity >= quantityAvailable : false}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {quantityAvailable && (
                <span className="text-sm text-muted-foreground">{quantityAvailable} available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <SheetFooter className="flex-shrink-0 border-t">
        <div className="flex gap-2 w-full">
          <Button
            className="flex-1 h-12 text-base font-semibold gap-2"
            size="lg"
            disabled={
              !availableForSale || (quantityAvailable ? quantity > quantityAvailable : false)
            }
            onClick={handleAddToCartAndClose}
          >
            <ShoppingBag className="h-5 w-5" />
            {availableForSale ? 'Add to Cart' : 'Sold Out'}
          </Button>
          <Button
            variant={isWishlisted ? 'default' : 'outline'}
            size="lg"
            className="h-12 w-12"
            onClick={() => handleWishlist().catch(console.error)}
          >
            <Heart className={cn('h-5 w-5', isWishlisted && 'fill-current')} />
          </Button>
        </div>

        <Link
          href={`${config.routes.collection}/products/${product.handle}`}
          className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={onClose}
        >
          View full details →
        </Link>
      </SheetFooter>
    </div>
  );
};

export default QuickBuyContent;
