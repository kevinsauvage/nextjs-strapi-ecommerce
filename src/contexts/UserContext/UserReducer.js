export const initialState = {
  addresses: undefined,
  loading: false,
  orders: [],
  ordersPageInfo: {},
  user: undefined,
  wishlist: [],
  wishlistLoading: false,
};

export const actions = {
  ADD_ADDRESSES: 'ADD_ADDRESSES',
  ADD_ORDERS: 'ADD_ORDERS',
  ADD_ORDERS_PAGEINFO: 'ADD_ORDERS_PAGEINFO',
  ADD_USER: 'ADD_USER',
  ADD_USER_WISHLIST: 'ADD_USER_WISHLIST',
  CHANGE_LOADING: 'CHANGE_LOADING',
  REMOVE_USER: 'REMOVE_USER',
  WISHLIST_LOADING: 'WISHLIST_LOADING',
};

export const UserReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actions.CHANGE_LOADING: {
      return { ...state, loading: payload };
    }
    case actions.ADD_USER: {
      return { ...state, user: payload };
    }
    case actions.REMOVE_USER: {
      return { ...state, user: undefined };
    }
    case actions.ADD_USER_WISHLIST: {
      return { ...state, wishlist: payload };
    }
    case actions.ADD_ADDRESSES: {
      return { ...state, addresses: payload };
    }
    case actions.ADD_ORDERS: {
      return { ...state, orders: [...state.orders, ...payload] };
    }
    case actions.ADD_ORDERS_PAGEINFO: {
      return { ...state, ordersPageInfo: payload };
    }

    case actions.WISHLIST_LOADING: {
      console.log({ payload });
      return { ...state, wishlistLoading: payload };
    }
    default: {
      return state;
    }
  }
};
