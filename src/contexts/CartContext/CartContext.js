import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { toast } from 'react-toastify';

import {
  cartBuyerIdentityUpdate,
  getCartById,
  addLinesToCart,
  createCart,
  removeLinesFromCart,
  updateLines,
} from '@/lib/shopify/cart/cartApiCall';

import { CartReducer, initialState, actions } from './CartReducer';
import useGlobalContext from '../GlobalContext/useGlobalContext';
import useUserContext from '../UserContext/useUserContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [states, dispatch] = useReducer(CartReducer, initialState);
  const [cartId, setCartId] = useLocalStorage('cartId', '');
  const { token } = useUserContext();
  const { toggleCart } = useGlobalContext();
  const { cart, isCartLoading, isCartOpen } = states;

  const toggleLoading = useCallback((is) => {
    dispatch({ type: 'IS_CART_LOADING', payload: is });
  }, []);

  const handleSetCart = useCallback((newCart) => {
    if (newCart?.id) {
      dispatch({ type: actions.ADD_CART, payload: newCart });
    }
  }, []);

  const addToCart = useCallback(
    async (merchandiseId, quantity, product = '') => {
      const lineItemsToAdd = [
        {
          merchandiseId,
          quantity: parseInt(quantity, 10),
          attributes: [{ key: 'product', value: product }],
        },
      ];
      toggleLoading(true);
      const res = await addLinesToCart(cartId, lineItemsToAdd);

      if (res?.cart?.id) {
        handleSetCart(res.cart);
        toggleCart(true);
      } else toast.error('Product not added. Try again later.');
    },
    [toggleCart, cartId, handleSetCart, toggleLoading]
  );

  const removeFromCart = useCallback(
    async (lineItemId) => {
      toggleLoading(true);
      const res = await removeLinesFromCart(cartId, [lineItemId]);
      if (res?.cart) handleSetCart(res.cart);
    },
    [toggleLoading, handleSetCart, cartId]
  );

  const handleQuantityChange = useCallback(
    async (quantity, id) => {
      toggleLoading(true);
      const lineItemsToUpdate = [{ id, quantity: parseInt(quantity, 10) }];
      const res = await updateLines(cartId, lineItemsToUpdate);
      if (res) handleSetCart(res);
    },
    [toggleLoading, cartId, handleSetCart]
  );

  // Create cart if carts ID doesn't exist in local storage
  useEffect(() => {
    if (!cartId) {
      createCart().then((res) => {
        if (res?.id) {
          handleSetCart(res);
          setCartId(res.id);
        }
      });
    }
  }, [cartId, handleSetCart, setCartId]);

  // If cartId is found in local storage, then get it from Shopify
  useEffect(() => {
    if (cartId && !cart) {
      getCartById(cartId).then((res) => handleSetCart(res));
    }
  }, [cartId, cart, handleSetCart]);

  // If user login,  associate user to cart
  useEffect(() => {
    if (token && cartId) {
      cartBuyerIdentityUpdate(cartId, {
        customerAccessToken: token.accessToken,
      });
    }
  }, [token, cartId]);

  const values = useMemo(
    () => ({
      // States
      cart,
      isCartLoading,

      // Functions
      addToCart,
      removeFromCart,
      handleQuantityChange,
    }),
    [cart, isCartLoading, addToCart, removeFromCart, handleQuantityChange]
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}
