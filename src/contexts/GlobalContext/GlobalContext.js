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
  const { cartOpen, searchOpen, userOpen, modalSelectedProduct } = states;

  const resetToggle = useCallback(() => {
    dispatch({ type: actions.RESET_TOGGLE_STATES });
  }, []);

  useEffect(() => {
    if (cartOpen || searchOpen || userOpen) {
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = 'visible';
  }, [cartOpen, searchOpen, userOpen]);

  const values = useMemo(
    () => ({
      searchOpen,
      cartOpen,
      userOpen,
      modalSelectedProduct,

      toggleSearch: () => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_SEARCH });
      },

      toggleCart: () => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_CART });
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
    [cartOpen, searchOpen, userOpen, modalSelectedProduct, resetToggle]
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
