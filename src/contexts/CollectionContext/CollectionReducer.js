// initial state
export const initialState = {
  allFilters: [],
  collection: {},
  collectionNav: [],
  layout: 'grid',
  loading: false,
  pageInfo: [],
  products: [],
  selectedFilters: [],
};

// actions
export const actions = {
  SET_ALL_FILTERS: 'SET_ALL_FILTERS',
  SET_COLLECTION: 'SET_COLLECTION',
  SET_COLLECTION_NAVIGATION: 'SET_COLLECTION_NAVIGATION',
  SET_LAYOUT: 'SET_LAYOUT',
  SET_LOADING: 'SET_LOADING',
  SET_PAGE_INFO: 'SET_PAGE_INFO',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_SELECTED_FILTERS: 'SET_SELECTED_FILTERS',
};

// Reducer
export const CollectionReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.SET_LOADING: {
      return { ...state, loading: payload };
    }
    case actions.SET_LAYOUT: {
      return { ...state, layout: payload };
    }
    case actions.SET_SELECTED_FILTERS: {
      return { ...state, selectedFilters: payload };
    }
    case actions.SET_PAGE_INFO: {
      return { ...state, pageInfo: payload };
    }
    case actions.SET_PRODUCTS: {
      return { ...state, products: payload };
    }
    case actions.SET_ALL_FILTERS: {
      return { ...state, allFilters: payload };
    }
    case actions.SET_COLLECTION_NAVIGATION: {
      return { ...state, collectionNav: payload };
    }
    case actions.SET_COLLECTION: {
      return { ...state, collection: payload };
    }
    default: {
      return state;
    }
  }
};
