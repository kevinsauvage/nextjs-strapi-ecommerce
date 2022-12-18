// initial state
export const initialState = {
  loading: false,
  actualFilters: [],
  notAppliedFilters: [],
  selectedFilters: [],
};

// actions
export const actions = {
  SET_LOADING: 'SET_LOADING',
  SET_ACTUAL_FILTERS: 'SET_ACTUAL_FILTERS',
  SET_NOT_APPLIED_FILTERS: 'SET_NOT_APPLIED_FILTER',
  SET_SELECTED_FILTERS: 'SET_SELECTED_FILTERS',
};

// Reducer
export const CollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_LOADING:
      return { ...state, loading: action.payload };

    case actions.SET_ACTUAL_FILTERS:
      return { ...state, actualFilters: action.payload };

    case actions.SET_NOT_APPLIED_FILTERS:
      return { ...state, notAppliedFilters: action.payload };

    case actions.SET_SELECTED_FILTERS:
      return { ...state, selectedFilters: action.payload };

    default:
      return state;
  }
};
