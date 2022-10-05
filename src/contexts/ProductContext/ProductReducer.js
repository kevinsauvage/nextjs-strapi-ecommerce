export const initialState = {
  selectedProduct: undefined,
};

export const actions = {
  SET_SELECTED_PRODUCT: 'SET_SELECTED_PRODUCT',
};

export const ProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_SELECTED_PRODUCT: {
      return { ...state, selectedProduct: action.payload };
    }

    default:
      return state;
  }
};
