import { useRouter } from 'next/router';
import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { generateDelegateToken } from '@/helpers/apiNext';
import { GlobalReducer, initialState, actions } from './GlobalReducer';

export const GlobalStoreContext = createContext();

export function GlobalProvider({ children }) {
  const [states, dispatch] = useReducer(GlobalReducer, initialState);
  const router = useRouter();
  const { searchOpen, selectedProduct, loading, filterOpen } = states;

  const resetToggle = useCallback(() => dispatch({ type: actions.RESET_TOGGLE_STATES }), []);

  const handleRender = useCallback(async () => {
    console.time('handleRender global context');
    const res = await generateDelegateToken();
    console.timeEnd('handleRender global context');
    if (!res?.ok) console.error("Couldn't  set delegate token");
  }, []);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  useEffect(() => {
    resetToggle();
  }, [router.asPath, resetToggle]);

  useEffect(() => {
    if (selectedProduct || loading || filterOpen) {
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = 'visible';
  }, [selectedProduct, loading, searchOpen, filterOpen]);

  const values = useMemo(
    () => ({
      searchOpen,
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

      setSelectedProduct: (payload) => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.SET_SELECTED_PRODUCT, payload });
      },

      resetToggle,
    }),
    [searchOpen, selectedProduct, loading, filterOpen, resetToggle]
  );

  return <GlobalStoreContext.Provider value={values}>{children}</GlobalStoreContext.Provider>;
}
