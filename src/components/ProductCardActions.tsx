'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';

import useUserContext from '@/contexts/UserContext/useUserContext';
import type { ProductFieldsFragment } from '@/shopify/storefront';

import QuickBuy from './QuickBuy';
import SpinnerLoader from './SpinnerLoader';
import { Button } from './ui/button';

type ProductCardActionsProps = {
  product: ProductFieldsFragment;
  productId: string;
};

const ProductCardActions = ({ product, productId }: ProductCardActionsProps) => {
  const { userWishlist, handleSetWishlist } = useUserContext();
  const [loading, setLoading] = useState(false);

  const isWishlisted = userWishlist?.find((item) => item.id === productId);

  const handleWishlist = async () => {
    setLoading(true);
    try {
      await handleSetWishlist(!!isWishlisted, product);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            void handleWishlist();
          }}
        >
          <Heart color="currentColor" className={isWishlisted ? 'fill-red-500' : ''} />
        </Button>

        <QuickBuy product={product} />
      </div>
    </>
  );
};

export default ProductCardActions;

