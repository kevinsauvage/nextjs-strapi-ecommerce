import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import nextApiCall from '@/utils/apiNext';
import { GlobalReducer, initialState, actions } from './GlobalReducer';

export const GlobalStoreContext = createContext();

export function GlobalProvider({ children }) {
  const [states, dispatch] = useReducer(GlobalReducer, initialState);
  const router = useRouter();
  const { checkoutOpen, searchOpen, selectedProduct, loading } = states;

  const resetToggle = useCallback(() => {
    dispatch({ type: actions.RESET_TOGGLE_STATES });
  }, []);

  const handleRender = useCallback(async () => {
    await nextApiCall.generateDelegateToken();
  }, []);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  useEffect(() => {
    resetToggle();
  }, [router.asPath, resetToggle]);

  useEffect(() => {
    if (checkoutOpen || searchOpen || selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = 'visible';
  }, [checkoutOpen, searchOpen, selectedProduct]);

  const values = useMemo(
    () => ({
      searchOpen,
      checkoutOpen,
      selectedProduct,
      loading,

      toggleLoading: (state) => {
        dispatch({ type: actions.TOGGLE_LOADING, payload: state });
      },

      toggleSearch: () => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_SEARCH });
      },

      toggleCheckout: () => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_CHECKOUT });
      },

      setSelectedProduct: (product) => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.SET_SELECTED_PRODUCT, payload: product });
      },

      resetToggle,
    }),
    [searchOpen, checkoutOpen, selectedProduct, loading, resetToggle]
  );

  return (
    <GlobalStoreContext.Provider value={values}>
      {children}
    </GlobalStoreContext.Provider>
  );
}
