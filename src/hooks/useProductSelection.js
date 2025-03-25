'use client';
import { useCallback, useEffect, useState } from 'react';

import useCartContext from '@/contexts/CartContext/useCartContext';
import { getDifference } from '@/utils/products';

const useProductSelection = ({ product }) => {
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState();

  const { handleAddToCart: handleAddToCartContext } = useCartContext();

  const handleChangeInput = useCallback((number_) => setQuantity(number_), []);

  const handleSetSelectedProductOption = useCallback(
    (productOption) => {
      if (Array.isArray(productOption)) return setSelectedProductOption(productOption);

      const filtered =
        selectedProductOption?.filter(
          (option) => Object.values(option)[0] !== Object.values(productOption)[0]
        ) || [];

      return setSelectedProductOption([...filtered, productOption]);
    },
    [selectedProductOption]
  );

  const handleAddToCart = useCallback(() => {
    handleAddToCartContext(selectedVariant.id, quantity);
  }, [handleAddToCartContext, quantity, selectedVariant?.id]);

  useEffect(() => {
    setSelectedVariant({});
  }, [selectedProductOption, product, setSelectedVariant]);

  // Initialize the selected product option
  useEffect(() => {
    if (product?.variants?.length) {
      const options =
        product?.variants?.filter((variant) => variant.availableForSale)?.[0]?.selectedOptions ||
        product?.variants?.[0]?.selectedOptions;
      setSelectedProductOption(options);
    }
  }, [product]);

  // Get variant from the options selected by the user
  useEffect(() => {
    if (product?.id && selectedProductOption?.length) {
      const dif = product?.variants?.filter(
        (variant) => !getDifference(variant.selectedOptions, selectedProductOption),
        {}
      );
      setSelectedVariant(...dif);
    }
  }, [selectedProductOption, product, setSelectedVariant]);

  useEffect(() => {
    if (quantity && selectedVariant?.id) {
      const amount = Number(selectedVariant?.priceV2?.amount) * quantity;
      setTotalPrice(amount.toFixed(2));
    }
  }, [quantity, selectedVariant, selectedVariant?.id]);

  return {
    handleAddToCart,
    handleChangeInput,
    handleSetSelectedProductOption,
    quantity,
    selectedProductOption,
    selectedVariant,
    totalPrice,
  };
};

export default useProductSelection;
