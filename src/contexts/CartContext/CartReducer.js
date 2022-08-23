export const initialState = {
  cart: [],
};

export const actions = {
  GET_CART: 'GET_CART',
};

export const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_SEARCH: {
      return { ...state, searchOpen: !state.searchOpen };
    }

    default:
      return state;
  }
};
