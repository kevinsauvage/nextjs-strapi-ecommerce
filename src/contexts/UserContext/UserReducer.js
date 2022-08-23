export const initialState = {
  user: {},
};

export const actions = {
  ADD_USER: 'ADD_USER',
  LOG_OUT: 'LOG_OUT',
  LOG_IN: 'LOG_IN',
};

export const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_USER: {
      return { ...state, user: action.payload };
    }

    case actions.LOG_OUT: {
      return { ...state, user: {} };
    }

    case actions.LOG_IN: {
      return { ...state, user: action.payload };
    }

    default:
      return state;
  }
};
