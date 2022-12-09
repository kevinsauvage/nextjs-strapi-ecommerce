// initial state
export const initialState = {
  checkout: undefined,
  isCheckoutLoading: false,
};

// actions
export const actions = {
  ADD_CHECKOUT: 'ADD_CHECKOUT',
  IS_CHECKOUT_LOADING: 'IS_CHECKOUT_LOADING',
};

// Reducer
export const CheckoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_CHECKOUT:
      return { ...state, checkout: action.payload, isCheckoutLoading: false };

    case actions.IS_CHECKOUT_LOADING:
      return { ...state, isCheckoutLoading: action.payload };

    default:
      return state;
  }
};
