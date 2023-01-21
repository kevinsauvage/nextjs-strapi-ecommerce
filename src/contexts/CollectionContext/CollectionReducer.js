// initial state
export const initialState = {
  loading: false,
  allFilters: [],
  selectedFilters: [],
  pageInfo: [],
  products: [],
  layout: 'grid',
};

// actions
export const actions = {
  SET_LOADING: 'SET_LOADING',
  SET_SELECTED_FILTERS: 'SET_SELECTED_FILTERS',
  SET_PAGE_INFO: 'SET_PAGE_INFO',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_ALL_FILTERS: 'SET_ALL_FILTERS',
  SET_LAYOUT: 'SET_LAYOUT',
};

// Reducer
export const CollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_LOADING:
      return { ...state, loading: action.payload };

    case actions.SET_SELECTED_FILTERS:
      return { ...state, selectedFilters: action.payload };

    case actions.SET_PAGE_INFO:
      return {
        ...state,
        pageInfo: action.payload,
      };

    case actions.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };

    case actions.SET_ALL_FILTERS:
      return {
        ...state,
        allFilters: action.payload,
      };

    case actions.SET_LAYOUT:
      return {
        ...state,
        layout: action.payload,
      };

    default:
      return state;
  }
};
