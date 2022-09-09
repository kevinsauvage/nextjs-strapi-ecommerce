export const initialState = {
  searchOpen: false,
  cartOpen: false,
  userOpen: false,
};

export const actions = {
  TOGGLE_SEARCH: 'TOGGLE_SEARCH',
  TOGGLE_CART: 'TOGGLE_CART',
  TOGGLE_USER: 'TOGGLE_USER',
  RESET_TOGGLE_STATES: 'RESET_TOGGLE_STATES',
};

export const GlobalReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_SEARCH: {
      return { ...state, searchOpen: !state.searchOpen };
    }
    case actions.TOGGLE_CART: {
      return { ...state, cartOpen: !state.cartOpen };
    }
    case actions.TOGGLE_USER: {
      return { ...state, userOpen: !state.userOpen };
    }

    case actions.RESET_TOGGLE_STATES: {
      return {
        ...state,
        cartOpen: false,
        userOpen: false,
        searchOpen: false,
        loginOpen: false,
      };
    }
    default:
      return state;
  }
};
