export const initialState = {
  selectedProduct: undefined,
  selectedProductOption: undefined,
  selectedVariant: undefined,
};

export const actions = {
  SET_SELECTED_PRODUCT: 'SET_SELECTED_PRODUCT',
  SET_SELECTED_PRODUCT_OPTION: 'SET_SELECTED_PRODUCT_OPTION',
  SET_SELECTED_VARIANT: 'SET_SELECTED_VARIANT',
};

export const ProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_SELECTED_PRODUCT: {
      return { ...state, selectedProduct: action.payload };
    }
    case actions.SET_SELECTED_PRODUCT_OPTION: {
      return { ...state, selectedProductOption: action.payload };
    }
    case actions.SET_SELECTED_VARIANT: {
      return { ...state, selectedVariant: action.payload };
    }

    default:
      return state;
  }
};
