import { useRouter } from 'next/router';
import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import nextApiCall from '@/utils/apiNext';
import { GlobalReducer, initialState, actions } from './GlobalReducer';

export const GlobalStoreContext = createContext();

export function GlobalProvider({ children }) {
  const [states, dispatch] = useReducer(GlobalReducer, initialState);
  const router = useRouter();
  const { checkoutOpen, searchOpen, selectedProduct, loading, filterOpen } = states;

  const resetToggle = useCallback(() => dispatch({ type: actions.RESET_TOGGLE_STATES }), []);

  const handleRender = useCallback(async () => {
    await nextApiCall.generateDelegateToken();
    dispatch({ type: actions.TOGGLE_LOADING, payload: false });
  }, []);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  useEffect(() => {
    resetToggle();
  }, [router.asPath, resetToggle]);

  useEffect(() => {
    if (checkoutOpen || selectedProduct || loading || filterOpen) {
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = 'visible';
  }, [checkoutOpen, selectedProduct, loading, searchOpen, filterOpen]);

  const values = useMemo(
    () => ({
      searchOpen,
      checkoutOpen,
      selectedProduct,
      loading,
      filterOpen,

      toggleLoading: (payload) => {
        dispatch({ type: actions.TOGGLE_LOADING, payload });
      },

      toggleFilter: (payload) => {
        dispatch({ type: actions.TOGGLE_FILTERS, payload });
      },

      toggleSearch: (payload) => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_SEARCH, payload });
      },

      toggleCheckout: () => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_CHECKOUT });
      },

      setSelectedProduct: (payload) => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.SET_SELECTED_PRODUCT, payload });
      },

      resetToggle,
    }),
    [searchOpen, checkoutOpen, selectedProduct, loading, filterOpen, resetToggle]
  );

  return <GlobalStoreContext.Provider value={values}>{children}</GlobalStoreContext.Provider>;
}
