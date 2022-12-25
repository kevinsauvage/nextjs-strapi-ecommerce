import { useCallback, useEffect, useState } from 'react';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import nextApiCall from '@/utils/apiNext';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';

const { userFeedback } = config;

/**
 * It's a custom hook that returns an object with a bunch of functions and state variables that are
 * used to manage the product selection process
 */
export default function useProductSelection({ product }) {
  const [selectedProductOption, setSelectedProductOption] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSize, setAvailableSize] = useState([]);
  const { handleResponse } = useCheckoutContext();
  const { toggleLoading } = useGlobalContext();

  const handleChangeInput = (num) => setQuantity(num);

  /**
   * If the quantity is greater than 0 and the variantId exists, then toggle the loading to true and then
   * call the nextApiCall.addToCheckout function with the variantId and quantity as parameters. Then,
   * call the handleResponse function with the response from the nextApiCall.addToCheckout function and
   * the userFeedback.addLinesToCheckout function as parameters.
   */
  const handleAddToCart = async () => {
    const variantId = selectedVariant?.id;
    if (quantity > 0 && variantId) {
      toggleLoading(true);
      const res = await nextApiCall.addToCheckout({ variantId, quantity });
      handleResponse(res, userFeedback.addLinesToCheckout);
    }
  };

  /* A function that is used to set the selected product option. */
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

  /**
   * It returns true if the two arrays have different objects, and false if they have the same objects.
   * @param array1 - [{name: 'name1', value: 'value1'}, {name: 'name2', value: 'value2'}]
   * @param array2 - [{name: 'name', value: 'value'}, {name: 'name', value: 'value'}]
   * @returns A boolean value.
   */
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

  /* A function that returns true if the optionName and optionValue are in the selectedProductOption
array. */
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

  /* A function that returns true if the optionName and optionValue are in the selectedProductOption
array. */
  const isOptionOutOfStock = useCallback(
    (optionName, optionValue) => {
      if (optionName === 'Color')
        return !availableColors?.includes(optionValue);
      if (optionName === 'Size') return !availableSize?.includes(optionValue);
      return false;
    },
    [availableColors, availableSize]
  );

  /* Resetting the selectedVariant state variable to an empty object. */
  useEffect(() => {
    setSelectedVariant({});
  }, [selectedProductOption, product, setSelectedVariant]);

  /* Setting the selectedProductOption state variable to the selectedOptions property of the first
variant in the variants array. */
  useEffect(() => {
    if (product?.variants?.length) {
      const options =
        product?.variants?.filter((variant) => variant.availableForSale)?.[0]
          ?.selectedOptions || product?.variants?.[0]?.selectedOptions;
      setSelectedProductOption(options);
    }
  }, [product, setSelectedVariant]);

  /* It's setting the selectedVariant state variable to the first variant in the variants array that has
the same selectedOptions as the selectedProductOption state variable. */
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

  /* It's setting the availableColors and availableSize state variables to the values of the
selectedOptions property of the variants in the variants array. */
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

  /* It's setting the availableColors and availableSize state variables to the values of the
selectedOptions property of the variants in the variants array. */
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
