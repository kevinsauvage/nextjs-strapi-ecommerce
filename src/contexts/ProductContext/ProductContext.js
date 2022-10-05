import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { getProductVariant } from '@/lib/shopify/product/productApiCall';
import { ProductReducer, initialState, actions } from './ProductReducer';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [states, dispatch] = useReducer(ProductReducer, initialState);
  const { selectedProductOption, selectedProduct, selectedVariant } =
    states || {};

  const setSelectedProductOption = useCallback(
    (productOption) => {
      if (Array.isArray(productOption)) {
        return dispatch({
          type: actions.SET_SELECTED_PRODUCT_OPTION,
          payload: productOption,
        });
      }

      let payload = {};

      if (selectedProductOption?.length > 0) {
        const filtered = selectedProductOption?.filter(
          (option) =>
            Object.values(option)[0] !== Object.values(productOption)[0]
        );
        console.log(filtered, 'filtered');

        payload = [...filtered, productOption];
      }

      return dispatch({
        type: actions.SET_SELECTED_PRODUCT_OPTION,
        payload,
      });
    },
    [selectedProductOption]
  );

  const setSelectedProduct = useCallback((product) => {
    dispatch({ type: actions.SET_SELECTED_PRODUCT, payload: product });
  }, []);

  const isOptionSelected = useCallback(
    (optionName, optionValue) =>
      selectedProductOption?.find(
        (option) => option.name === optionName && option.value === optionValue
      ),
    [selectedProductOption]
  );

  const setSelectedVariant = useCallback(async (variant) => {
    dispatch({ type: actions.SET_SELECTED_VARIANT, payload: variant });
  }, []);

  useEffect(() => {
    console.log('selectedProductOption', selectedProductOption);
  }, [selectedProductOption]);

  useEffect(() => {
    console.log('selectedVariant', selectedVariant);
  }, [selectedVariant]);

  const values = useMemo(
    () => ({
      selectedProduct,
      selectedVariant,
      selectedProductOption,
      setSelectedProductOption,
      setSelectedProduct,
      isOptionSelected,
      setSelectedVariant,
    }),
    [
      selectedVariant,
      selectedProduct,
      selectedProductOption,
      setSelectedProductOption,
      setSelectedVariant,
      setSelectedProduct,
      isOptionSelected,
    ]
  );

  return (
    <ProductContext.Provider value={values}>{children}</ProductContext.Provider>
  );
}
