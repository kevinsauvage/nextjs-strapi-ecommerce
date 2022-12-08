export const initialState = {
  searchOpen: false,
  checkoutOpen: false,
  userOpen: false,
  isHeaderActive: false,
  modalSelectedProduct: undefined,
};

export const actions = {
  TOGGLE_SEARCH: 'TOGGLE_SEARCH',
  TOGGLE_USER: 'TOGGLE_USER',
  TOGGLE_CHECKOUT: 'TOGGLE_CHECKOUT',
  RESET_TOGGLE_STATES: 'RESET_TOGGLE_STATES',
  MODAL_SELECTED_PRODUCT: 'MODAL_SELECTED_PRODUCT',
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
    case actions.MODAL_SELECTED_PRODUCT: {
      return { ...state, modalSelectedProduct: action.payload };
    }
    case actions.RESET_TOGGLE_STATES: {
      return {
        ...state,
        checkoutOpen: false,
        userOpen: false,
        searchOpen: false,
        loginOpen: false,
        modalSelectedProduct: false,
      };
    }
    default:
      return state;
  }
};
