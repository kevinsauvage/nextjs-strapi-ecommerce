import { useRouter } from 'next/router';
import { createContext, useEffect, useMemo, useReducer } from 'react';
import { GlobalReducer, initialState, actions } from './GlobalReducer';

export const GlobalStoreContext = createContext();

export function GlobalProvider({ children }) {
  const [states, dispatch] = useReducer(GlobalReducer, initialState);

  const values = useMemo(
    () => ({
      searchOpen: states.searchOpen,
      cartOpen: states.cartOpen,
      userOpen: states.userOpen,
      loginOpen: states.loginOpen,

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
      toggleLogin: () => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
        dispatch({ type: actions.TOGGLE_LOGIN });
      },

      resetToggle: () => {
        dispatch({ type: actions.RESET_TOGGLE_STATES });
      },
    }),
    [states]
  );

  const router = useRouter();

  useEffect(() => {
    values.resetToggle();
  }, [router.asPath]);

  return (
    <GlobalStoreContext.Provider value={values}>
      {children}
    </GlobalStoreContext.Provider>
  );
}
