'use client';

import { useCallback, useEffect, useState } from 'react';

import useCartContext from '@/contexts/CartContext/useCartContext';
import type { GetProductByHandleQuery, ProductFieldsFragment } from '@/shopify/storefront';
type OptionValues = ProductFieldsFragment['options'][number]['optionValues'][number];

type SelectedProductOptionType = {
  id: string;
  name: string;
  optionValues: OptionValues;
};

const useProductSelection = ({ product }: { product: GetProductByHandleQuery['product'] }) => {
  const [selectedVariant, setSelectedVariant] = useState<
    GetProductByHandleQuery['product']['variants']['edges'][0]['node'] | undefined
  >();
  const [selectedProductOption, setSelectedProductOption] = useState<
    SelectedProductOptionType[] | undefined
  >([]);

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const { handleAddToCart: handleAddToCartContext } = useCartContext();

  const handleChangeInput = useCallback(
    (number_: number) => {
      setQuantity(number_);
      if (number_ && selectedVariant?.id) {
        const amount = Number(selectedVariant?.price?.amount) * number_;
        setTotalPrice(Number(amount.toFixed(2)));
      }
    },
    [selectedVariant],
  );

  const selectVariantByOptions = useCallback(
    (options: SelectedProductOptionType[]) => {
      const selectedOptions = options.map((option) => ({
        name: option.name,
        value: option.optionValues.name,
      }));

      const selected = product?.variants?.edges?.find((variant) => {
        const variantOptions = variant.node.selectedOptions;
        return selectedOptions.every((option) =>
          variantOptions.some(
            (variantOption) =>
              variantOption.name === option.name && variantOption.value === option.value,
          ),
        );
      });

      setSelectedVariant(selected?.node);
    },
    [product],
  );

  const handleSetSelectedProductOption = useCallback(
    (id: string, name: string, optionValues: OptionValues) => {
      setSelectedProductOption((previous) => {
        const newOptions = previous?.map((option) => {
          return option?.name === name ? { ...option, id, optionValues } : option;
        });
        selectVariantByOptions(newOptions);
        return newOptions;
      });
    },
    [selectVariantByOptions],
  );

  const isOptionOutOfStock = (name: string, optionValue: OptionValues) => {
    const isOUt = product?.variants?.edges?.some((variant) => {
      const selectedOptions = variant.node.selectedOptions;
      return selectedOptions.some(
        (option) => option.name === name && option.value === optionValue?.name,
      );
    });
    return !isOUt;
  };

  const isOptionSelected = (name: string, value: OptionValues) => {
    return selectedProductOption?.some(
      (selectedOption) =>
        selectedOption.name === name && selectedOption.optionValues.name === value.name,
    );
  };

  const handleAddToCart = useCallback(() => {
    if (selectedVariant?.id) {
      handleAddToCartContext(selectedVariant.id, quantity).catch((error) => {
        console.error('Error adding to cart:', error);
      });
    }
  }, [handleAddToCartContext, quantity, selectedVariant?.id]);

  useEffect(() => {
    setSelectedVariant(product?.variants?.edges?.[0]?.node);
    setSelectedProductOption(
      product?.options?.map((option) => ({
        id: option.id,
        name: option.name,
        optionValues: option.optionValues[0] as OptionValues,
      })) || [],
    );
    selectVariantByOptions(
      product?.options?.map((option) => ({
        id: option.id,
        name: option.name,
        optionValues: option.optionValues[0] as OptionValues,
      })) || [],
    );
  }, [product, selectVariantByOptions]);

  return {
    handleAddToCart,
    handleChangeInput,
    handleSetSelectedProductOption,
    isOptionOutOfStock,
    isOptionSelected,
    quantity,
    selectedProductOption,
    selectedVariant,
    totalPrice,
  };
};

export default useProductSelection;
