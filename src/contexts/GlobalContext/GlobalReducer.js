export const initialState = {
  searchOpen: false,
  selectedProduct: undefined,
  loading: false,
  filterOpen: false,
};

export const actions = {
  TOGGLE_SEARCH: 'TOGGLE_SEARCH',
  RESET_TOGGLE_STATES: 'RESET_TOGGLE_STATES',
  SET_SELECTED_PRODUCT: 'SET_SELECTED_PRODUCT',
  TOGGLE_LOADING: 'TOGGLE_LOADING',
  TOGGLE_FILTERS: 'TOGGLE_FILTERS',
};

export const GlobalReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_SEARCH: {
      return { ...state, searchOpen: action.payload };
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
      return { ...initialState, loading: action.loading };
    }
    default:
      return state;
  }
};
