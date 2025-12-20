'use client';

import { ShoppingCart } from 'lucide-react';

import useCartContext from '@/contexts/CartContext/useCartContext';

const CartHeader = () => {
  const { cart } = useCartContext();

  return (
    <div className="flex items-center">
      <ShoppingCart className="h-5 w-5 mr-2" />
      <span className="font-medium">{cart.totalQuantity} Items</span>
    </div>
  );
};

export default CartHeader;
