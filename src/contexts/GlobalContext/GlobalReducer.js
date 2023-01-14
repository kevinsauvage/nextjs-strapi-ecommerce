export const initialState = {
  checkoutOpen: false,
  searchOpen: false,
  selectedProduct: undefined,
  loading: false,
  filterOpen: false,
};

export const actions = {
  TOGGLE_SEARCH: 'TOGGLE_SEARCH',
  TOGGLE_CHECKOUT: 'TOGGLE_CHECKOUT',
  RESET_TOGGLE_STATES: 'RESET_TOGGLE_STATES',
  SET_SELECTED_PRODUCT: 'SET_SELECTED_PRODUCT',
  TOGGLE_LOADING: 'TOGGLE_LOADING',
  TOGGLE_FILTERS: 'TOGGLE_FILTERS',
};

export const GlobalReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_SEARCH: {
      return { ...state, searchOpen: !state.searchOpen };
    }
    case actions.TOGGLE_CHECKOUT: {
      return { ...state, checkoutOpen: !state.checkoutOpen };
    }
    case actions.SET_SELECTED_PRODUCT: {
      return { ...state, selectedProduct: action.payload };
    }

    case actions.TOGGLE_LOADING: {
      return { ...state, loading: action.payload };
    }

    case actions.TOGGLE_FILTERS: {
      return { ...state, filterOpen: action.payload };
    }

    case actions.RESET_TOGGLE_STATES: {
      return initialState;
    }
    default:
      return state;
  }
};
