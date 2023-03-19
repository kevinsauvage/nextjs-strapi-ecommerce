export const initialState = {
  loading: false,
  searchOpen: false,
  selectedProduct: undefined,
  showBannerCookies: false,
  showModalCookies: false,
};

export const actions = {
  RESET_TOGGLE_STATES: 'RESET_TOGGLE_STATES',
  SET_SELECTED_PRODUCT: 'SET_SELECTED_PRODUCT',
  SHOW_BANNER_COOKIES: 'SHOW_BANNER_COOKIES',
  SHOW_MODAL_COOKIES: 'SHOW_MODAL_COOKIES',
  TOGGLE_LOADING: 'TOGGLE_LOADING',
  TOGGLE_SEARCH: 'TOGGLE_SEARCH',
};

export const GlobalReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.TOGGLE_SEARCH: {
      return { ...state, searchOpen: payload };
    }
    case actions.SET_SELECTED_PRODUCT: {
      return { ...state, selectedProduct: payload };
    }
    case actions.TOGGLE_LOADING: {
      return { ...state, loading: payload };
    }
    case actions.RESET_TOGGLE_STATES: {
      return { ...initialState, loading: payload };
    }

    case actions.SHOW_BANNER_COOKIES: {
      return { ...initialState, showBannerCookies: payload };
    }

    case actions.SHOW_MODAL_COOKIES: {
      return { ...initialState, showModalCookies: payload };
    }
    default: {
      return state;
    }
  }
};
