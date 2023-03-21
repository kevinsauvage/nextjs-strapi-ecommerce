import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router';

import nextApiHelper from '@/helpers/api-next';
import { getCookieFront, tranformedSettings } from '@/helpers/cookies';

import { actions, GlobalReducer, initialState } from './GlobalReducer';

export const GlobalStoreContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [states, dispatch] = useReducer(GlobalReducer, initialState);
  const { asPath, events } = useRouter();

  const handleRender = useCallback(async () => {
    const response = await nextApiHelper('/api/delegate-token', '', 'GET');
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

  const setShowBannerCookies = useCallback((payload) => {
    dispatch({ payload, type: actions.SHOW_BANNER_COOKIES });
  }, []);

  const setShowModalCookies = useCallback((payload) => {
    dispatch({ payload, type: actions.SHOW_MODAL_COOKIES });
  }, []);

  useEffect(() => {
    handleRender();
  }, [handleRender]);

  useEffect(() => {
    dispatch({ type: actions.RESET_TOGGLE_STATES });
  }, [asPath]);

  const handleCookies = () => {
    const consent = getCookieFront('localConsent');
    if (consent) window.gtag('consent', 'update', tranformedSettings(JSON.parse(consent)));
    else dispatch({ payload: true, type: actions.SHOW_BANNER_COOKIES });
  };

  useEffect(() => {
    handleCookies();
    const handleRouteChange = () => {
      handleCookies();
    };
    events.on('routeChangeComplete', handleRouteChange);

    return () => {
      events.off('routeChangeComplete', handleRouteChange);
    };
  }, [events]);

  const values = useMemo(
    () => ({
      ...states,

      setSelectedProduct,
      setShowBannerCookies,
      setShowModalCookies,
      toggleLoading,
      toggleSearch,
    }),
    [
      setSelectedProduct,
      setShowBannerCookies,
      states,
      toggleLoading,
      toggleSearch,
      setShowModalCookies,
    ]
  );

  return <GlobalStoreContext.Provider value={values}>{children}</GlobalStoreContext.Provider>;
};
