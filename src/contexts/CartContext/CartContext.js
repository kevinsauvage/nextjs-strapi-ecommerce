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
  const { userAccessToken } = useUserContext();
  const { toggleCart } = useGlobalContext();
  const { cart, isCartLoading } = states;

  const toggleLoading = useCallback(
    () => dispatch({ type: 'TOGGLE_CART_LOADING' }),
    []
  );

  const handleSetCart = useCallback((c) => {
    if (c?.id) {
      dispatch({ type: actions.ADD_CART, payload: c });
    }
  }, []);

  const handleCreateCart = useCallback(async () => {
    const res = await createCart();
    if (res?.id) {
      handleSetCart(res);
      setCartId(res.id);
    }
  }, [setCartId, handleSetCart]);

  useEffect(() => {
    if (!cartId) handleCreateCart();
  }, [handleCreateCart, cartId]);

  const handleGetCartById = useCallback(
    async (id) => {
      const res = await getCartById(id);
      handleSetCart(res);
    },
    [handleSetCart]
  );

  useEffect(() => {
    if (cartId && !cart) handleGetCartById(cartId);
  }, [cartId, handleGetCartById, cart]);

  useEffect(() => {
    if (userAccessToken && cartId) {
      cartBuyerIdentityUpdate(cartId, { customerAccessToken: userAccessToken });
    }
  }, [userAccessToken, cartId]);

  const addToCart = useCallback(
    async (merchandiseId, quantity, product = '') => {
      const lineItemsToAdd = [
        {
          merchandiseId,
          quantity: parseInt(quantity, 10),
          attributes: [{ key: 'product', value: product }],
        },
      ];

      const res = await addLinesToCart(cartId, lineItemsToAdd);

      if (res?.cart?.id) {
        handleSetCart(res.cart);
        toggleCart(true);
      } else toast.error('Product not added. Try again later.');
    },
    [toggleCart, cartId, handleSetCart]
  );

  const removeFromCart = useCallback(
    async (lineItemId) => {
      toggleLoading();
      const res = await removeLinesFromCart(cartId, [lineItemId]);
      if (res?.cart) handleSetCart(res.cart);
    },
    [toggleLoading, handleSetCart, cartId]
  );

  const handleQuantityChange = useCallback(
    async (quantity, id) => {
      toggleLoading();
      const lineItemsToUpdate = [{ id, quantity: parseInt(quantity, 10) }];
      const res = await updateLines(cartId, lineItemsToUpdate);
      if (res) handleSetCart(res);
    },
    [toggleLoading, cartId, handleSetCart]
  );

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
