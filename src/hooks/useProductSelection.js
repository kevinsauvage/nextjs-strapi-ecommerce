import { useCallback, useEffect, useState } from 'react';
import useCartContext from '@/contexts/CartContext/useCartContext';

export default function useProductSelection({ product }) {
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartContext();

  const handleChangeInput = (num) => setQuantity(num);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(selectedVariant.id, quantity, JSON.stringify(product));
    }
  };

  const handleSetSelectedProductOption = useCallback(
    (productOption) => {
      if (Array.isArray(productOption)) {
        return setSelectedProductOption(productOption);
      }

      const filtered = selectedProductOption?.filter(
        (option) => Object.values(option)[0] !== Object.values(productOption)[0]
      );
      return setSelectedProductOption([...filtered, productOption]);
    },
    [selectedProductOption]
  );

  const getDifference = (array1, array2) => {
    const difference = array1?.filter(
      (object1) =>
        !array2?.some(
          (object2) =>
            object1.name === object2.name && object1.value === object2.value
        )
    );

    if (difference.length) return true;
    return false;
  };

  const isOptionSelected = useCallback(
    (optionName, optionValue) =>
      selectedProductOption?.find(
        (option) => option.name === optionName && option.value === optionValue
      ),
    [selectedProductOption]
  );

  useEffect(() => {
    const options = product?.variants?.[0]?.selectedOptions;
    if (options) setSelectedProductOption(options);
  }, [product, setSelectedVariant]);

  useEffect(() => {
    if (product?.id && selectedProductOption?.length) {
      const dif = product.variants.filter(
        (variant) =>
          !getDifference(variant.selectedOptions, selectedProductOption),
        {}
      );
      setSelectedVariant(...dif);
    }
  }, [selectedProductOption, product, setSelectedVariant]);

  return {
    isOptionSelected,
    handleSetSelectedProductOption,
    handleAddToCart,
    handleChangeInput,
    quantity,
    selectedProductOption,
    selectedVariant,
  };
}
