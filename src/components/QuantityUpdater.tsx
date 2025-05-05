'use client';

import { useCallback, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import { Button } from './ui/button';

const QuantityUpdater = ({
  originalQuantity,
  quantityAvailable,
  productId,
  onChange,
  disabled,
}: {
  originalQuantity: number;
  quantityAvailable: number;
  productId: string;
  disabled?: boolean;
  onChange:
    | ((_id: string, _quantity: number) => Promise<void>)
    | ((id: string, number_: number) => void);
}) => {
  const [quantity, setQuantity] = useState(originalQuantity);
  const [loading, setLoading] = useState(false);

  const removeOne = useCallback(async () => {
    if (quantity <= 1) return;
    setQuantity((previous) => previous - 1);
    setLoading(true);
    await onChange(productId, quantity - 1);
    setLoading(false);
  }, [onChange, productId, quantity]);

  const addOne = useCallback(async () => {
    if (quantity >= quantityAvailable) return;
    setQuantity((previous) => previous + 1);
    setLoading(true);
    await onChange(productId, quantity + 1);
    setLoading(false);
  }, [onChange, productId, quantity, quantityAvailable]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          removeOne().catch(() => {
            // Handle error if needed
          });
        }}
        disabled={loading || disabled || originalQuantity <= 1}
      >
        <Minus className="h-3 w-3" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <span className="w-8 text-center">{originalQuantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          addOne().catch(() => {
            // Handle error if needed
          });
        }}
        disabled={loading || disabled || originalQuantity >= quantityAvailable}
      >
        <Plus className="h-3 w-3" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
};

export default QuantityUpdater;
