'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import SpinnerLoader from '@/components/SpinnerLoader';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useCartContext from '@/contexts/CartContext/useCartContext';

const CartRemove = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);
  const { removeFromCart } = useCartContext();

  const handleRemove = async () => {
    if (!id) return console.error('Missing line item to delete');
    setLoading(true);
    try {
      await removeFromCart(id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              void handleRemove();
            }}
            disabled={loading}
            aria-label="Remove item from cart"
            className="text-secondary hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            {loading ? (
              <SpinnerLoader size="sm" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Remove item</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Remove from cart</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CartRemove;
