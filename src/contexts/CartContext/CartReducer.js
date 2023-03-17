// initial state
export const initialState = {
  cart: undefined,
  isLoading: true,
};

// actions
export const actions = {
  ADD_CART: 'ADD_CART',
  IS_CART_LOADING: 'IS_CART_LOADING',
};

// Reducer
export const CartReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.ADD_CART: {
      return { ...state, cart: payload, isLoading: false };
    }
    case actions.IS_CART_LOADING: {
      return { ...state, isLoading: payload };
    }
    default: {
      return state;
    }
  }
};
