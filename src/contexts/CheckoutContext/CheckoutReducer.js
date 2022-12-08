// initial state
export const initialState = {
  isCheckoutOpen: false,
  checkout: undefined,
  isCheckoutLoading: false,
};

// actions
export const actions = {
  ADD_CHECKOUT: 'ADD_CHECKOUT',
  IS_CHECKOUT_LOADING: 'IS_CHECKOUT_LOADING',
  REMOVE_CHECKOUT: 'REMOVE_CHECKOUT',
};

// Reducer
export const CheckoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_CHECKOUT:
      return { ...state, checkout: action.payload, isCheckoutLoading: false };

    case actions.IS_CHECKOUT_LOADING:
      return { ...state, isCheckoutLoading: action.payload };

    case actions.REMOVE_CHECKOUT: {
      console.log('REMOVE_CHECKOUT');
      return { ...state, checkout: undefined };
    }

    default:
      return state;
  }
};
