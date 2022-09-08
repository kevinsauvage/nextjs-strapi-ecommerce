// initial state
export const initialState = {
  isCartOpen: false,
  checkout: { lineItems: [] },
  isCheckoutLoading: true,
};

// actions
export const actions = {
  CLIENT_CREATED: 'CLIENT_CREATED',
  CHECKOUT_FOUND: 'CHECKOUT_FOUND',
  ADD_VARIANT_TO_CART: 'ADD_VARIANT_TO_CART',
  UPDATE_QUANTITY_IN_CART: 'UPDATE_QUANTITY_IN_CART',
  REMOVE_LINE_ITEM_IN_CART: 'REMOVE_LINE_ITEM_IN_CART',
  OPEN_CART: 'OPEN_CART',
  CLOSE_CART: 'CLOSE_CART',
  TOGGLE_CART_LOADING: 'TOGGLE_CART_LOADING',
};

// Reducer
export const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.CLIENT_CREATED:
      return { ...state, client: action.payload };

    case actions.CHECKOUT_FOUND:
      return { ...state, checkout: action.payload, isCheckoutLoading: false };

    case actions.ADD_VARIANT_TO_CART:
      return {
        ...state,
        isCartOpen: action.payload.isCartOpen,
        checkout: action.payload.checkout,
        isCheckoutLoading: false,
      };

    case actions.UPDATE_QUANTITY_IN_CART:
      return {
        ...state,
        checkout: action.payload.checkout,
        isCheckoutLoading: false,
      };

    case actions.REMOVE_LINE_ITEM_IN_CART:
      return {
        ...state,
        checkout: action.payload.checkout,
        isCheckoutLoading: false,
      };

    case actions.TOGGLE_CART_LOADING:
      return {
        ...state,
        isCheckoutLoading: true,
      };

    case actions.OPEN_CART:
      return { ...state, isCartOpen: true };

    case actions.CLOSE_CART:
      return { ...state, isCartOpen: false };
    default:
      return state;
  }
};
