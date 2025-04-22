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

  const handleChangeInput = useCallback((number_: number) => setQuantity(number_), []);

  const handleSetSelectedProductOption = useCallback(
    (id: string, name: string, optionValues: OptionValues) => {
      setSelectedProductOption((previous) => {
        const selectedOption = previous?.find((option) => option.id === id);
        if (selectedOption) {
          return previous?.map((option) =>
            option.id === id ? { ...option, name, optionValues } : option,
          );
        }
        return [...(previous || []), { id, name, optionValues }];
      });
    },
    [setSelectedProductOption],
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

  const isOptionSelected = (id: string, optionValue: OptionValues) => {
    const selectedOption = selectedProductOption?.find((option) => option.id === id);
    if (selectedOption) {
      return selectedOption.optionValues?.id === optionValue?.id;
    }
    return false;
  };

  const isOptionOutOfStock = (name: string, optionValue: OptionValues) => {
    const isOUt = product?.variants?.edges?.some((variant) => {
      const selectedOptions = variant.node.selectedOptions;
      return selectedOptions.some(
        (option) => option.name === name && option.value === optionValue?.name,
      );
    });
    return !isOUt;
  };

  const handleAddToCart = useCallback(() => {
    if (selectedVariant?.id) {
      handleAddToCartContext(selectedVariant.id, quantity);
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
  }, [product]);

  useEffect(() => {
    if (quantity && selectedVariant?.id) {
      const amount = Number(selectedVariant?.price?.amount) * quantity;
      setTotalPrice(Number(amount.toFixed(2)));
    }
  }, [quantity, selectedVariant, selectedVariant?.id]);

  useEffect(() => {
    if (selectedProductOption?.length) {
      selectVariantByOptions(selectedProductOption);
    }
  }, [selectedProductOption, selectVariantByOptions]);

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
