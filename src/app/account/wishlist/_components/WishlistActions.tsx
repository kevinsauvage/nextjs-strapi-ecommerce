'use client';

import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useCartContext from '@/contexts/CartContext/useCartContext';
import { removeFromWishlist } from '@/lib/wishlist-client';
import type { ProductFieldsFragment } from '@/shopify/storefront';

type WishlistActionsProps = {
  product: ProductFieldsFragment;
  onRemove?: () => void;
};

const WishlistActions = ({ product, onRemove }: WishlistActionsProps) => {
  const router = useRouter();
  const { handleAddToCart } = useCartContext();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const result = await removeFromWishlist(product.id);
      if (result?.success) {
        toast.success('Removed from wishlist');
        onRemove?.();
        router.refresh();
      } else {
        toast.error(result?.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error removing from wishlist:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const onAddToCart = async () => {
    if (!product.variants?.edges?.[0]?.node) {
      toast.error('Product variant not available');
      return;
    }

    setIsAddingToCart(true);
    try {
      const variant = product.variants.edges[0].node;
      await handleAddToCart(variant.id, 1);
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Heart size={18} className="fill-current" />
          <span className="sr-only">Wishlist actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onAddToCart} disabled={isAddingToCart || isRemoving}>
          <ShoppingCart size={16} className="mr-2" />
          Add to cart
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleRemove}
          disabled={isRemoving || isAddingToCart}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 size={16} className="mr-2" />
          Remove from wishlist
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WishlistActions;
