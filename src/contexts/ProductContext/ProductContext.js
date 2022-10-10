import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { ProductReducer, initialState, actions } from './ProductReducer';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [states, dispatch] = useReducer(ProductReducer, initialState);
  const { selectedProduct } = states || {};
  const router = useRouter();

  const setSelectedProduct = useCallback((product) => {
    dispatch({ type: actions.SET_SELECTED_PRODUCT, payload: product });
  }, []);

  useEffect(() => {
    setSelectedProduct(null);
  }, [setSelectedProduct, router.asPath]);

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
