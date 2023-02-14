export const initialState = {
  user: undefined,
  loading: false,
  addresses: undefined,
  orders: [],
  ordersPageInfo: {},
};

export const actions = {
  ADD_USER: 'ADD_USER',
  REMOVE_USER: 'REMOVE_USER',
  CHANGE_LOADING: 'CHANGE_LOADING',
  ADD_ADDRESSES: 'ADD_ADDRESSES',
  ADD_ORDERS: 'ADD_ORDERS',
  ADD_ORDERS_PAGEINFO: 'ADD_ORDERS_PAGEINFO',
};

export const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_USER: {
      return { ...state, user: action.payload };
    }

    case actions.REMOVE_USER: {
      return { ...state, user: undefined };
    }

    case actions.CHANGE_LOADING: {
      return { ...state, loading: action.payload };
    }

    case actions.ADD_ADDRESSES: {
      return { ...state, addresses: action.payload };
    }

    case actions.ADD_ORDERS: {
      return { ...state, orders: [...state.orders, ...action.payload] };
    }
    case actions.ADD_ORDERS_PAGEINFO: {
      return { ...state, ordersPageInfo: action.payload };
    }
    default:
      return state;
  }
};
