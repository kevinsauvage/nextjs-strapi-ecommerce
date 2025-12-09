'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import useCartContext from '@/contexts/CartContext/useCartContext';

const CartRemove = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);
  const { removeFromCart } = useCartContext();

  const handleRemove = async () => {
    if (!id) return console.error('Missing line item to delete');
    setLoading(true);
    await removeFromCart(id);
    setLoading(false);
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={() => {
        handleRemove().catch(() => {
          // Handle error if needed
        });
      }}
      disabled={loading}
      aria-label="Remove item from cart"
      title="Remove item from cart"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Remove item</span>
    </Button>
  );
};

export default CartRemove;
