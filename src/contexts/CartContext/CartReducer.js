// initial state
export const initialState = {
  isCartOpen: false,
  cart: undefined,
  isCartLoading: true,
};

// actions
export const actions = {
  ADD_CART: 'ADD_CART',
  OPEN_CART: 'OPEN_CART',
  CLOSE_CART: 'CLOSE_CART',
  TOGGLE_CART_LOADING: 'TOGGLE_CART_LOADING',
};

// Reducer
export const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_CART:
      return { ...state, cart: action.payload, isCartLoading: false };

    case actions.ADD_VARIANT_TO_CART:
      return {
        ...state,
        isCartOpen: action.payload.isCartOpen,
        cart: action.payload,
        isCartLoading: false,
      };

    case actions.TOGGLE_CART_LOADING:
      return {
        ...state,
        isCartLoading: true,
      };

    case actions.OPEN_CART:
      return { ...state, isCartOpen: true };

    case actions.CLOSE_CART:
      return { ...state, isCartOpen: false };
    default:
      return state;
  }
};
