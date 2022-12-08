import { useCallback, useEffect, useState } from 'react';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';

export default function useProductSelection({ product }) {
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSize, setAvailableSize] = useState([]);
  const { addToCheckout } = useCheckoutContext();

  const handleChangeInput = (num) => setQuantity(num);

  const handleAddToCart = () => {
    if (quantity > 0) addToCheckout(selectedVariant.id, quantity);
  };

  const handleSetSelectedProductOption = useCallback(
    (productOption) => {
      if (Array.isArray(productOption)) {
        return setSelectedProductOption(productOption);
      }

      const filtered =
        selectedProductOption?.filter(
          (option) =>
            Object.values(option)[0] !== Object.values(productOption)[0]
        ) || [];
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

    if (difference?.length) return true;
    return false;
  };

  // Find if the option is selected
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

  // Find if the option value is not available
  const isOptionOutOfStock = useCallback(
    (optionName, optionValue) => {
      if (optionName === 'Color')
        return !availableColors?.includes(optionValue);
      if (optionName === 'Size') return !availableSize?.includes(optionValue);
      return false;
    },
    [availableColors, availableSize]
  );

  // Reset variant
  useEffect(() => {
    setSelectedVariant({});
  }, [selectedProductOption, product, setSelectedVariant]);

  // Find available variant options
  useEffect(() => {
    if (product?.variants?.length) {
      const options =
        product?.variants?.filter((variant) => variant.availableForSale)?.[0]
          ?.selectedOptions || product?.variants?.[0]?.selectedOptions;
      setSelectedProductOption(options);
    }
  }, [product, setSelectedVariant]);

  // Find Selected variant by variant options
  useEffect(() => {
    if (product?.id && selectedProductOption?.length) {
      const dif = product?.variants?.filter(
        (variant) =>
          !getDifference(variant.selectedOptions, selectedProductOption),
        {}
      );
      setSelectedVariant(...dif);
    }
  }, [selectedProductOption, product, setSelectedVariant]);

  // Find available option Value to update the available options array (array used the function isOptionOutOfStock)
  useEffect(() => {
    if (product?.id && selectedProductOption?.length) {
      const colors = [];
      const sizes = [];
      product.variants
        .filter((variant) => variant.availableForSale)
        .forEach((variant) => {
          variant.selectedOptions.forEach((option) => {
            selectedProductOption
              .filter((opt) => opt.name === 'Color')
              .forEach((opt) => {
                if (option.value === opt.value)
                  sizes.push(
                    variant.selectedOptions.filter(
                      (o) => o.name === 'Size'
                    )?.[0]?.value
                  );
              });
            selectedProductOption
              .filter((opt) => opt.name === 'Size')
              .forEach((opt) => {
                if (option.value === opt.value)
                  colors.push(
                    variant.selectedOptions.filter((o) => o.name === 'Color')[0]
                      .value
                  );
              });
          });
        });
      setAvailableSize(sizes);
      setAvailableColors(colors);
    }
  }, [selectedProductOption, product, setSelectedVariant]);

  // Set array of available Size
  useEffect(() => {
    if (product?.variants && !availableColors?.length) {
      const sizes = [];
      product?.variants
        .filter((variant) => variant.quantityAvailable)
        .forEach((variant) => {
          const colorOption = variant.selectedOptions.filter(
            (option) => option.name === 'Size'
          );
          if (colorOption?.[0]?.value) sizes.push(colorOption[0].value);
        });
      const unique = [...new Set(sizes)];
      setAvailableSize(unique);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.variants]);

  return {
    isOptionSelected,
    isOptionOutOfStock,
    handleSetSelectedProductOption,
    handleAddToCart,
    handleChangeInput,
    quantity,
    selectedProductOption,
    selectedVariant,
    availableColors,
  };
}
