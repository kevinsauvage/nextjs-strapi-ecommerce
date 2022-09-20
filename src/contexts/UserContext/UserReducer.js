export const initialState = {
  user: {},
  loading: false,
};

export const actions = {
  ADD_USER: 'ADD_USER',
  REMOVE_USER: 'REMOVE_USER',
  CHANGE_LOADING: 'CHANGE_LOADING',
};

export const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_USER: {
      return { ...state, user: action.payload };
    }

    case actions.REMOVE_USER: {
      return { ...state, user: {} };
    }

    case actions.CHANGE_LOADING: {
      return { ...state, loading: action.payload };
    }

    default:
      return state;
  }
};
