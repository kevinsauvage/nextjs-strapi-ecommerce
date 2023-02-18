import { useCallback, useEffect, useState } from 'react';
import useCartContext from '@/contexts/CartContext/useCartContext';

export default function useProductSelection({ product }) {
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState();

  const { handleAddToCart: handleAddToCartContext } = useCartContext();

  const handleChangeInput = (num) => setQuantity(num);

  const handleSetSelectedProductOption = useCallback(
    (productOption) => {
      if (Array.isArray(productOption)) {
        return setSelectedProductOption(productOption);
      }

      const filtered =
        selectedProductOption?.filter(
          (option) => Object.values(option)[0] !== Object.values(productOption)[0]
        ) || [];
      return setSelectedProductOption([...filtered, productOption]);
    },
    [selectedProductOption]
  );

  const getDifference = useCallback((array1, array2) => {
    const difference = array1?.filter(
      (object1) =>
        !array2?.some((object2) => object1.name === object2.name && object1.value === object2.value)
    );

    if (difference?.length) return true;
    return false;
  }, []);

  const isOptionSelected = useCallback(
    (optionName, optionValue) => {
      if (selectedProductOption?.length) {
        return selectedProductOption?.find(
          (option) => option.name === optionName && option.value === optionValue
        );
      }
      return false;
    },
    [selectedProductOption]
  );

  const isOptionOutOfStock = useCallback(
    (optionName, optionValue) => {
      const dif = product?.variants?.filter((variant) => {
        const selection = selectedProductOption.map((option) => {
          if (option.name === optionName) return { name: optionName, value: optionValue };
          return option;
        });

        return !getDifference(variant.selectedOptions, selection);
      }, {});
      if (dif?.length) return false;
      return true;
    },
    [getDifference, product?.variants, selectedProductOption]
  );

  const handleAddToCart = useCallback(() => {
    handleAddToCartContext(selectedVariant.id, quantity);
  }, [handleAddToCartContext, quantity, selectedVariant.id]);

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
  }, [selectedProductOption, product, setSelectedVariant, getDifference]);

  useEffect(() => {
    if (quantity && selectedVariant?.id) {
      const amount = Number(selectedVariant?.priceV2?.amount) * quantity;
      setTotalPrice(amount.toFixed(2));
    }
  }, [quantity, selectedVariant, selectedVariant?.id]);

  return {
    isOptionSelected,
    isOptionOutOfStock,
    handleSetSelectedProductOption,
    handleAddToCart,
    handleChangeInput,
    quantity,
    selectedProductOption,
    selectedVariant,
    totalPrice,
  };
}
