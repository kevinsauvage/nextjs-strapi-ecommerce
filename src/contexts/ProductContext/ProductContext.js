import { createContext, useCallback, useMemo, useReducer } from 'react';
import { ProductReducer, initialState, actions } from './ProductReducer';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [states, dispatch] = useReducer(ProductReducer, initialState);
  const { selectedProduct } = states || {};

  const setSelectedProduct = useCallback((product) => {
    dispatch({ type: actions.SET_SELECTED_PRODUCT, payload: product });
  }, []);

  const values = useMemo(
    () => ({
      selectedProduct,
      setSelectedProduct,
    }),
    [selectedProduct, setSelectedProduct]
  );

  return (
    <ProductContext.Provider value={values}>{children}</ProductContext.Provider>
  );
}
