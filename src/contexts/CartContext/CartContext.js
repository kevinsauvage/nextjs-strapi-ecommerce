import { createContext, useMemo, useReducer } from 'react';
import { CartReducer, initialState, actions } from './CartReducer';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [states, dispatch] = useReducer(CartReducer, initialState);

  const values = useMemo(
    () => ({
      cart: states.cart,

      addToCart: async (product, quantity) => {
        dispatch({
          type: actions.ADD_TO_CART,
          payload: { product, quantity },
        });
      },
    }),
    [states]
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}
