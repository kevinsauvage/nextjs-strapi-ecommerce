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

  const resetToggle = useCallback(() => {
    dispatch({ type: actions.RESET_TOGGLE_STATES });
  }, []);

  const values = useMemo(
    () => ({
      searchOpen: states.searchOpen,
      cartOpen: states.cartOpen,
      userOpen: states.userOpen,
      modalSelectedProduct: states.modalSelectedProduct,

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

      setSelectedModalProduct: (product) => {
        console.log(product);
        dispatch({ type: actions.MODAL_SELECTED_PRODUCT, payload: product });
      },

      resetToggle,
    }),
    [states, resetToggle]
  );

  const router = useRouter();

  useEffect(() => {
    resetToggle();
  }, [router.asPath, resetToggle]);

  return (
    <GlobalStoreContext.Provider value={values}>
      {children}
    </GlobalStoreContext.Provider>
  );
}
