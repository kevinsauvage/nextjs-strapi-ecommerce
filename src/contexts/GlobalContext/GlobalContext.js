import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router';

import { generateDelegateToken } from '@/helpers/apiNext';

import { actions, GlobalReducer, initialState } from './GlobalReducer';

export const GlobalStoreContext = createContext();

export function GlobalProvider({ children }) {
  const [states, dispatch] = useReducer(GlobalReducer, initialState);
  const router = useRouter();
  const { searchOpen, selectedProduct, loading } = states;

  const resetToggle = useCallback(() => dispatch({ type: actions.RESET_TOGGLE_STATES }), []);

  const handleRender = useCallback(async () => {
    const res = await generateDelegateToken();
    if (!res?.ok) console.error('Couldn\'t  set delegate token');
  }, []);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  useEffect(() => {
    resetToggle();
  }, [router.asPath, resetToggle]);

  const values = useMemo(
    () => ({
      searchOpen,
      selectedProduct,
      loading,

      toggleLoading: (payload) => {
        dispatch({ type: actions.TOGGLE_LOADING, payload });
      },

      toggleSearch: (payload) => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_SEARCH, payload });
      },

      setSelectedProduct: (payload) => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.SET_SELECTED_PRODUCT, payload });
      },

      resetToggle,
    }),
    [searchOpen, selectedProduct, loading, resetToggle],
  );

  return <GlobalStoreContext.Provider value={values}>{children}</GlobalStoreContext.Provider>;
}
