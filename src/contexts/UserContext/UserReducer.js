export const initialState = {
  user: {},
};

export const actions = {
  ADD_USER: 'ADD_USER',
  REMOVE_USER: 'REMOVE_USER',
};

export const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_USER: {
      return { ...state, user: action.payload };
    }

    case actions.REMOVE_USER: {
      return { ...state, user: {} };
    }

    default:
      return state;
  }
};
