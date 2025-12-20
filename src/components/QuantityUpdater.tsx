'use client';

import { Minus, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import SpinnerLoader from '@/components/SpinnerLoader';

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
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    setLoading(true);
    try {
      await onChange(productId, newQuantity);
    } finally {
      setLoading(false);
    }
  }, [onChange, productId, quantity]);

  const addOne = useCallback(async () => {
    if (quantity >= quantityAvailable) return;
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setLoading(true);
    try {
      await onChange(productId, newQuantity);
    } finally {
      setLoading(false);
    }
  }, [onChange, productId, quantity, quantityAvailable]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          void removeOne();
        }}
        disabled={loading || disabled || originalQuantity <= 1}
      >
        {loading ? <SpinnerLoader size="sm" /> : <Minus className="h-3 w-3" />}
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <span className="w-8 text-center text-body-sm">{originalQuantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          void addOne();
        }}
        disabled={loading || disabled || originalQuantity >= quantityAvailable}
      >
        {loading ? <SpinnerLoader size="sm" /> : <Plus className="h-3 w-3" />}
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
};

export default QuantityUpdater;
