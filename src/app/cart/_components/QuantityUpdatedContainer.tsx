'use client';

import QuantityUpdater from '@/components/QuantityUpdater';
import useCartContext from '@/contexts/CartContext/useCartContext';

const QuantityUpdatedContainer = ({
  originalQuantity,
  quantityAvailable,
  id,
}: {
  originalQuantity: number;
  quantityAvailable: number;
  id: string;
}) => {
  const { handleQuantityChange } = useCartContext();

  return (
    <QuantityUpdater
      originalQuantity={originalQuantity}
      quantityAvailable={quantityAvailable}
      productId={id}
      onChange={handleQuantityChange}
    />
  );
};

export default QuantityUpdatedContainer;
