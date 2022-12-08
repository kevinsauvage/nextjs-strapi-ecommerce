import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { GlobalReducer, initialState, actions } from './GlobalReducer';

export const GlobalStoreContext = createContext();

export function GlobalProvider({ children }) {
  const [states, dispatch] = useReducer(GlobalReducer, initialState);
  const router = useRouter();
  const { checkoutOpen, searchOpen, userOpen, modalSelectedProduct } = states;

  const resetToggle = useCallback(() => {
    dispatch({ type: actions.RESET_TOGGLE_STATES });
  }, []);

  useEffect(() => {
    if (checkoutOpen || searchOpen || userOpen) {
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = 'visible';
  }, [checkoutOpen, searchOpen, userOpen]);

  const values = useMemo(
    () => ({
      searchOpen,
      checkoutOpen,
      userOpen,
      modalSelectedProduct,

      toggleSearch: () => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_SEARCH });
      },

      toggleCheckout: () => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_CHECKOUT });
      },

      toggleUser: () => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_USER });
      },

      setCollections: (collections) => {
        dispatch({ type: actions.SET_COLLECTIONS, payload: collections });
      },

      resetToggle,
    }),
    [checkoutOpen, searchOpen, userOpen, modalSelectedProduct, resetToggle]
  );

  useEffect(() => {
    resetToggle();
  }, [router.asPath, resetToggle]);

  return (
    <GlobalStoreContext.Provider value={values}>
      {children}
    </GlobalStoreContext.Provider>
  );
}
