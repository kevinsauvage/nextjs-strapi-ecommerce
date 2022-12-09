export const initialState = {
  checkoutOpen: false,
  userOpen: false,
  searchOpen: false,
  selectedProduct: undefined,
};

export const actions = {
  TOGGLE_SEARCH: 'TOGGLE_SEARCH',
  TOGGLE_USER: 'TOGGLE_USER',
  TOGGLE_CHECKOUT: 'TOGGLE_CHECKOUT',
  RESET_TOGGLE_STATES: 'RESET_TOGGLE_STATES',
  SET_SELECTED_PRODUCT: 'SET_SELECTED_PRODUCT',
};

export const GlobalReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_SEARCH: {
      return { ...state, searchOpen: !state.searchOpen };
    }
    case actions.TOGGLE_CHECKOUT: {
      return { ...state, checkoutOpen: !state.checkoutOpen };
    }
    case actions.TOGGLE_USER: {
      return { ...state, userOpen: !state.userOpen };
    }
    case actions.SET_SELECTED_PRODUCT: {
      return { ...state, selectedProduct: action.payload };
    }
    case actions.RESET_TOGGLE_STATES: {
      return initialState;
    }
    default:
      return state;
  }
};
