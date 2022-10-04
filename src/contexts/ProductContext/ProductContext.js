import { createContext, useCallback, useMemo, useReducer } from 'react';
import { getProductVariant } from '@/lib/shopify/product/productApiCall';
import { ProductReducer, initialState, actions } from './ProductReducer';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [states, dispatch] = useReducer(ProductReducer, initialState);
  const { selectedProductOption, selectedProduct, selectedVariant } =
    states || {};

  const setSelectedProductOption = useCallback(
    (handle, productOption) => {
      if (Array.isArray(productOption)) {
        return dispatch({
          type: actions.SET_SELECTED_PRODUCT_OPTION,
          payload: {
            handle,
            productOptions: productOption,
          },
        });
      }

      let payload = {};

      if (
        selectedProductOption?.handle === handle &&
        selectedProductOption?.productOptions.length > 0
      ) {
        const exist = selectedProductOption?.productOptions.find(
          (option) =>
            Object.values(option)[0] === Object.values(productOption)[0]
        );

        if (exist) {
          payload = {
            handle,
            productOptions: [
              ...selectedProductOption.productOptions.filter(
                (option) =>
                  Object.values(option)[0] !== Object.values(productOption)[0]
              ),
              productOption,
            ],
          };
        }

        if (!exist) {
          payload = {
            handle,
            productOptions: [
              ...selectedProductOption.productOptions,
              productOption,
            ],
          };
        }
      } else {
        payload = { handle, productOptions: [productOption] };
      }

      return dispatch({
        type: actions.SET_SELECTED_PRODUCT_OPTION,
        payload,
      });
    },
    [selectedProductOption]
  );

  const setSelectedProduct = useCallback((product) => {
    console.log(product, 'product selected');
    dispatch({ type: actions.SET_SELECTED_PRODUCT, payload: product });
  }, []);

  const isOptionSelected = useCallback(
    (optionName, optionValue) =>
      selectedProductOption?.productOptions.find(
        (option) => option.name === optionName && option.value === optionValue
      ),
    [selectedProductOption]
  );

  const setSelectedVariant = useCallback(
    async (handle) => {
      const variant = await getProductVariant(
        handle,
        selectedProductOption?.productOptions
      );
      dispatch({ type: actions.SET_SELECTED_VARIANT, payload: variant });
    },
    [selectedProductOption]
  );
  console.log(selectedProduct);

  const values = useMemo(
    () => ({
      selectedProduct,
      selectedProductOption,
      selectedVariant,
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
