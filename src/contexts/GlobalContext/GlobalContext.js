import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router';

import { generateDelegateToken } from '@/helpers/api-next';

import { actions, GlobalReducer, initialState } from './GlobalReducer';

export const GlobalStoreContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [states, dispatch] = useReducer(GlobalReducer, initialState);
  const { asPath } = useRouter();

  const handleRender = useCallback(async () => {
    const response = await generateDelegateToken();
    if (!response?.ok) console.error("Couldn't  set delegate token");
  }, []);

  const toggleLoading = useCallback((payload) => {
    dispatch({ payload, type: actions.TOGGLE_LOADING });
  }, []);

  const toggleSearch = useCallback((payload) => {
    dispatch({ type: actions.RESET_TOGGLE_STATES });
    dispatch({ payload, type: actions.TOGGLE_SEARCH });
  }, []);

  const setSelectedProduct = useCallback((payload) => {
    dispatch({ type: actions.RESET_TOGGLE_STATES });
    dispatch({ payload, type: actions.SET_SELECTED_PRODUCT });
  }, []);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  useEffect(() => {
    dispatch({ type: actions.RESET_TOGGLE_STATES });
  }, [asPath]);

  const values = useMemo(
    () => ({
      ...states,

      setSelectedProduct,
      toggleLoading,
      toggleSearch,
    }),
    [setSelectedProduct, states, toggleLoading, toggleSearch]
  );

  return <GlobalStoreContext.Provider value={values}>{children}</GlobalStoreContext.Provider>;
};
